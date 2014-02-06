effdate
=======

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
