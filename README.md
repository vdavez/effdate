effdate
=======

# Description
Under section 602(c) of the Home Rule Act, most Council acts** must be transmitted to Congress for 30-day passive review. In 40 years of Home Rule, there have only been 3 instances where Congress has exercised its power under section 602(c) to disapprove of Council acts.

Making matters worse, Congress decided that 30 days would be too easy to calculate, so Congress defined the 30-day period as follows:

> the 30-calendar-day period (excluding Saturdays, Sundays, and holidays, and any day on which neither House is in session because of an adjournment sine die, a recess of more than 3 days, or an adjournment of more than 3 days) beginning on the day such act is transmitted by the Chairman to the Speaker of the House of Representatives and the President of the Senate

Until now, calculating the 30-day period required reference to several calendars and hand counts. This counter actually computes the proper date with one caveat: it is only accurate retrospectively...

That is because we can't actually know when Congress will be in recess (or not) before they go in recess (or don't). So, to write a program to let the public know when a bill actually would become a law would require a change in the Home Rule Act.

** The main exceptions are (1) acts affecting the criminal code, which have 60-day periods, and (2) Charter amendments, which have a 35-day count (though the counting method is slightly different).

# API Usage
The API for effdate is available at /api/1/ and will return a JSON object. 

## Query
| param | optional  | value     | description                 | example             |
| ----- |-----------|-----------|-----------------------------|---------------------|
| t     | false     | date      | transmittal date            | t=2014-01-01        |
| c     | true      | 30 or 60  | the number of days counted  | c=60                |
| p     | true      | yes       | whether to use the predictive date or not | p=yes |

E.g., ```/api/1/?q=2014-01-01&c=60&p=yes``` 

## Response
| field         | description                                                               |
|---------------| --------------------------------------------------------------------------|
| transmittal   | date that the act was transmitted to Congress (equal to the "t" parameter)|
| effdate       | the computed effective date of the act                                    |
| days_array    | the array of days that count toward the effective date of the act         |
| effdate_long  | a formatted, computed effective date of the act                           |
| criminal      | whether the count was 60 days                                             |
| prediction    | whether the count was predicted (if false, then count is "best case")     |
