#!/bin/bash
#cd public
#python -m SimpleHTTPServer 8000
twistd -n web -p 8000 --path public
