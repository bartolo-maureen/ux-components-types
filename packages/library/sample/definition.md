# UX Components
## Components
### Input
* password - auth optional
* passCode - auth optional
* cardPin - authenticated

### Span
* cardNumber
* cvv
* cardPin

### verification
* kyb
* kycBeneficiaries
* kyc


## changes
```
.captureCardNumber()
.displayCardNumber()
```
### Input
* [X] To remove
    * [X] passwordNumeric
    * [X] cardNumber
    * [X] cvv
* Error Handling
    * [x] UIKey + auth token invalid - error codes
    * [x] mount - invalid selector
    * [ ] on change - emit event with error codes
### Documentation
* [ ] documentation
### Verification
* [x] sumsub only
* [x] captureBeneficiariesKyc()
* [x] captureConsumerKyc()
* [x] captureCorporateKyb()

### other
* [x] cad pin requires user auth



----

### Update to Maria
#### changes in function call
```
.captureCardNumber() -> .capture.cardNumber()
.displayCardNumber() -> .display.cardNumber()
```
**OK**

#### token per component
* issue with keeping token in sync - can only be done by firing event
* async issue
**OK to be as it used to be**


#### Error Code
* ui key
  * returns 500 error with no response object
**remove it**


----
# Error 
*  [x] remove error messages - replace with error code
  
* [ ] everything to be expressed in error codes
    * empty
    * invalid
        * min max
        * regex
* [x] Incorrect ui key
    * handle only empty
