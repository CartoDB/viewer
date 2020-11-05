#!/bin/bash
# v1.1.1

## Example of usage: ./deploy/scripts/sync_bucket.sh <bucket-name> <folder_to_upload>
## Example of usage: ./deploy/scripts/sync_bucket.sh viewer-carto-deckgl ./build/

# Abort if error
set -e

bad_usage(){
    echo 'Bad parameters:'
    echo "Usage: $0 <domain> <folder_to_upload> [<common_cache_control> <index_cache_control>]"
    echo ""
    echo "Note that parameters between '[...]' are optionals"
    exit 1
}

check_bucket_exist() {
    gsutil ls gs://${DOMAIN} &> /dev/null
    echo $?
}

create_bucket(){
    echo "Bucket doen't exist. Please create it manually before execute that script."
    echo "Remembre, you need to:"
    echo "  - Create it"
    echo "  - Add view permissions to public users"
    echo "  - Set main page and error page"
    echo "  - Set cors config"
    echo "  - Add the bucket to a LoadBalancer"
    exit 1
    gsutil mb -l eu gs://${DOMAIN}
    gsutil iam ch allUsers:objectViewer gs://${DOMAIN}
    gsutil web set -m index.html -e index.html gs://${DOMAIN}
}

sync(){
    echo ""
    echo "Synchronizing files..."
    set -x
    gsutil -h "Cache-Control:${COMMON_CACHE_CONTROL}" -m rsync -x "deploy\/.*$|\.git\/.*$|Jenkinsfile$|Dockerfile$" -r -d ${FOLDER} gs://${DOMAIN}
    set +x
    if [[ -f "${FOLDER}/index.html" ]]; then
        echo "Adding custom Cache-Control to index.html"
        set -x
        gsutil setmeta -h "Cache-Control:${INDEX_CACHE_CONTROL}" gs://${DOMAIN}/index.html
        set +x
    fi
}

if  [[ $# -lt 2 && $# -gt 4 ]] ; then
    bad_usage
    exit 1
fi

DOMAIN=$1
FOLDER=$2
COMMON_CACHE_CONTROL=${3:-public,max-age=600,s-maxage=300}
INDEX_CACHE_CONTROL=${4:-public,max-age=180,s-maxage=30}

if [ "$(check_bucket_exist)" -ne 0 ]; then
    echo "Bucket doesn't exist, creating . . . ."
    create_bucket
fi

sync
