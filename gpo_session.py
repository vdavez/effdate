#!/usr/bin/env/ python

import requests
from datetime import date, timedelta
from time import strftime


def daterange(start_date, end_date):
    for n in range(int ((end_date - start_date).days)):
        yield start_date + timedelta(n)

def checkGPO (day, house):
  url = 'http://www.gpo.gov/fdsys/pkg/CREC-' + day + '/pdf/CREC-' + day + '-' + house + '.pdf';
  r = requests.head(url)
  if (r.status_code == 200):
    return day
  else:
    return False

a = date(1996, 1, 1)
b = date(2014, 5, 5)
chambers = ["house", "senate"]

f = open('gpo_days.csv','a')

for c in chambers:
  f.write("\n" + c)
  for single_date in daterange(a, b):
    out = checkGPO(strftime("%Y-%m-%d", single_date.timetuple()),c)
    if out != False:
      f.write(out + ",")