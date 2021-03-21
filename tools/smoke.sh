#!/usr/bin/env bash

if [[ $(curl -s -o /dev/null -w "%{http_code}" https://shows.bertie.dev/shows) != 200 ]]; then
    exit 1
fi

exit 0
