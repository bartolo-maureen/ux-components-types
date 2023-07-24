# UX Security Model Client

## Client

The entry point for the client is client.ts, which imports lib/client/index.ts

The security model works by setting a global window attribute OpcUxSecureClient which gives accss to the api. In the meantine, an iframe to SECURE_LOCATION is created, which pulls in a minimal stylesheet and the server.js payload. The application page can invoke actions on the root frame.

### Actions

 - INIT (the first action to be invoked, supplies the api key)
 - FETCH_FONT (instructs the root frame to fetch a font css file and pass the font faces to the elements)
 - TOKENIZE (instructs the root frame to collect fields related to a specific form and tokenize the data)
 - ASSOCIATE (instructs the root frame to associate the Authorization header with a secure session. This allows owned tokenization and detokenization)


The protocol between the application page and this iframe (referred to as the ROOT frame) is as follows:

```
                APPLICATION <> ROOT
handshake       <- opc-uxsec-root-load
                (... optional action to load fonts, see action below)
                -> opc-uxsec-ready

action          -> opc-uxsec-root-action
                <- opc-uxsec-root-action-complete or opc-uxsec-root-action-error

new element     -> opc-uxsec-create-input or opc-uxsec-create-span
destroy element -> opc-uxsec-destroy
```

When an element is created, a corresponding iframe is also created. In this iframe, there is either an input to collect sensitive information prior to tokenization, or a span to display sensitive information after detokenization. The parent page can receive events from the element.

### Common events

- load (the element page loaded)
- ready (the element is ready)
- dimensions (the element's dimensions changed)

### Input only

- redirectfocus (indicates that the focus changed to prev / next)
- focus
- blur
- keyup (only Enter and Escape are reported)
- change (state changed, e.g. valid to invalid)
- autofill
- autofill-cleared

The protocol between the application page and element frames is as follows:

```
                APPLICATION <> ELEMENT
handshake       -> opc-uxsec-root-load (or #loaded=true)

event           <- opc-uxsec-element-event 

update          -> opc-uxsec-update

mount           -> opc-uxsec-mount

focus           -> opc-uxsec-focus

clear           -> opc-uxsec-clear
```

## Server

The server js payload changes behaviour depending on the type attribute passed to the iframe, which can be root, input or span. This allows the js file to be cached and reused by all the iframes, instead of 3 different js files. The root frame tracks all the frames created by the parent page and speaks to the API. The element frames themselves do not speak to the api. 

Tokenization is invoked on a form, which is simply a collection of inputs with the same form id. The root sends a request to each input to collect the data and then submits the data for tokenization to the backend. Detokenization is done field by field, with the root frame requesting the detokenization of the data and sending the detokenized data to the span frame through a request. De/tokenization of owned tokens is only allowed if the session has been associated.

The protocol between element frames and the root frame is as follows:

```
                ELEMENT <> ROOT
handshake       -> opc-uxsec-element-load
                <- opc-uxsec-root-init

update          <- opc-uxsec-root-update

request         <- opc-uxsec-element-request 
                -> opc-uxsec-element-request-complete or opc-uxsec-element-request-error
```