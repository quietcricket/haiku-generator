# Haiku Generator with OpanAI

## Summary
This is a prototype testing OpenAI's text completion function with their Davinci model.

## Architecture

### AWS Lambda for backend
The backend server uses AWS lambda function. The dependency on openai package is quite troublesome.
A standard custom layer with virutalenv route does not work because openai depends on numpy.
The workaround I found is manually remove numpy and pandas from the layer file. Put AWSSDK numpy layer first
then the trimmed custom layer zip. 

The OpenAI key is passed via environment variable. So, please do not forget to set OPENAI_KEY in lambda or
testing locally.

### React with Typescript for frontend
The frontend is built with react and TypeScript. It's very simple but I wanted use this project
to practice react and TypeScript, so it's a bit more complicated.
