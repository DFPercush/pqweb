#!/bin/bash
#cat /tmp/units.in | sed s/{\ *UN\(\\\(.*\\\)\)\\\(.*\\\){\\\(.*\\\)}.*/du\(\\\1\\\2[\\\3/ | sed s/}}/]/ | sed s/}/]/ | sed s/],.*/]\)/ | sed s/]\\\ *$/]\)/


cat /tmp/units.in | sed s/UN// | sed s/\(// | sed s/\)// | sed s-//.*-- | sed s/\\\ *$// | sed s/{\\\(.*\\\)}/\\\1/ | sed s/{/[/ | sed s/}/,0]/ | sed s/\\\(.*\\\),/\\\1/ | sed s/\\\(.*\\\)/du\(\\\1\),/
