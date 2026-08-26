#!/usr/bin/env bash
# Namecheap API helper — point the domain at your hosting from the terminal.
#
# WHAT THE NAMECHEAP API DOES AND DOESN'T DO
#   Does:     domains (register, renew, transfer), DNS records, SSL, WHOIS,
#             email forwarding.
#   Does NOT: upload files, deploy sites, or touch anything inside cPanel.
#             There is no "publish my website" endpoint. For files, use
#             deploy/ftp-deploy.sh or cPanel's File Manager.
#
# BEFORE THIS WORKS
#   1. namecheap.com → Profile → Tools → Namecheap API Access → toggle ON.
#      Eligibility: 20+ domains on the account, OR $50+ account balance,
#      OR $50+ spent in the last two years. A single domain usually isn't
#      enough on its own — topping the balance to $50 is the usual fix.
#   2. Whitelist the IP you'll call from, on that same page. Calls from any
#      other address are rejected outright, and that's the error people
#      most often mistake for a bad key.
#   3. Fill in deploy/.namecheap-credentials (chmod 600, gitignored):
#
#        NC_API_USER=yourNamecheapUsername
#        NC_API_KEY=the-key-from-that-page
#        NC_USERNAME=yourNamecheapUsername
#        NC_CLIENT_IP=203.0.113.7        # the whitelisted IP
#
# USAGE
#   ./deploy/namecheap-dns.sh list                    show current DNS records
#   ./deploy/namecheap-dns.sh point 162.0.229.100     A record for @ and www
#   ./deploy/namecheap-dns.sh --sandbox list          against the test API
#
# The IP to point at is in cPanel → General Information → Shared IP Address.

set -euo pipefail
cd "$(dirname "$0")/.."

CREDS="deploy/.namecheap-credentials"
API="https://api.namecheap.com/xml.response"
SLD="yardscaledigital"
TLD="com"

if [ "${1:-}" = "--sandbox" ]; then
  API="https://api.sandbox.namecheap.com/xml.response"
  shift
fi
CMD="${1:-list}"

[ -f "$CREDS" ] || { echo "No $CREDS — see the comments at the top of this script."; exit 1; }
perms=$(stat -c '%a' "$CREDS" 2>/dev/null || stat -f '%Lp' "$CREDS")
[ "$perms" = "600" ] || { echo "$CREDS is mode $perms. Run: chmod 600 $CREDS"; exit 1; }

# shellcheck disable=SC1090
source "$CREDS"
: "${NC_API_USER:?NC_API_USER missing}"
: "${NC_API_KEY:?NC_API_KEY missing}"
: "${NC_USERNAME:?NC_USERNAME missing}"
: "${NC_CLIENT_IP:?NC_CLIENT_IP missing}"

AUTH="ApiUser=$NC_API_USER&ApiKey=$NC_API_KEY&UserName=$NC_USERNAME&ClientIp=$NC_CLIENT_IP"

# Namecheap answers 200 with an <Errors> block on failure, so the exit code
# tells you nothing — the body has to be inspected.
call() {
  local body
  body=$(curl -sS --fail-with-body --max-time 30 "$API" -d "$1") || {
    echo "Request failed to reach the API."; exit 1;
  }
  if grep -q '<Errors>[^<]*<Error' <<<"$body"; then
    echo "Namecheap rejected the call:"
    sed -n 's/.*<Error Number="\([0-9]*\)">\([^<]*\)<\/Error>.*/  [\1] \2/p' <<<"$body"
    case "$body" in
      *"Invalid request IP"*|*"not whitelisted"*)
        echo
        echo "  → That IP isn't whitelisted. Add $NC_CLIENT_IP under"
        echo "    Profile → Tools → Namecheap API Access." ;;
      *"API Key is invalid"*|*"API access"*)
        echo
        echo "  → API access is off, or the key is wrong. Same page." ;;
    esac
    exit 1
  fi
  printf '%s' "$body"
}

case "$CMD" in
  list)
    echo "Current DNS for $SLD.$TLD"
    echo
    call "$AUTH&Command=namecheap.domains.dns.getHosts&SLD=$SLD&TLD=$TLD" \
      | sed -n 's/.*<host[^>]*Name="\([^"]*\)"[^>]*Type="\([^"]*\)"[^>]*Address="\([^"]*\)"[^>]*TTL="\([^"]*\)".*/  \2\t\1\t→ \3\t(ttl \4)/p'
    echo
    echo "Note: these only apply while the domain uses Namecheap BasicDNS."
    echo "If you set custom nameservers to your hosting, edit DNS there instead."
    ;;

  point)
    IP="${2:-}"
    [ -n "$IP" ] || { echo "Usage: $0 point <server-ip>"; exit 1; }
    grep -Eq '^[0-9]{1,3}(\.[0-9]{1,3}){3}$' <<<"$IP" || { echo "'$IP' is not an IPv4 address."; exit 1; }

    # setHosts REPLACES the entire record set — anything not sent is deleted.
    # So this deliberately writes only the two records the site needs, and
    # says so loudly rather than silently dropping MX or TXT records.
    cat <<WARN
About to REPLACE every DNS record on $SLD.$TLD with:

  A     @      → $IP
  A     www    → $IP

setHosts is all-or-nothing: any MX, TXT or CNAME record currently set —
including the ones your business email needs — will be removed.

Run '$0 list' first and copy anything you need to keep.
WARN
    read -r -p "Type REPLACE to continue: " confirm
    [ "$confirm" = "REPLACE" ] || { echo "Cancelled."; exit 0; }

    call "$AUTH&Command=namecheap.domains.dns.setHosts&SLD=$SLD&TLD=$TLD\
&HostName1=@&RecordType1=A&Address1=$IP&TTL1=1800\
&HostName2=www&RecordType2=A&Address2=$IP&TTL2=1800" >/dev/null
    echo "Done. DNS usually propagates in 30 minutes, occasionally a few hours."
    ;;

  *)
    echo "Unknown command '$CMD'. Try: list | point <ip>"
    exit 1
    ;;
esac
