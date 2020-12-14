# Waracle-Test
### Endpoints
GET - https://en62yw2j7f.execute-api.eu-west-1.amazonaws.com/test/cakes

GET - https://en62yw2j7f.execute-api.eu-west-1.amazonaws.com/test/cakes/{id}

POST - https://en62yw2j7f.execute-api.eu-west-1.amazonaws.com/test/cakes

Example payload
```
{
  "id": 1607871126046,
  "name": "test-cake-1607871125046",
  "comment": "yummy",
  "imageUrl": "image1",
  "yumFactor": 5
}
```

PUT - https://en62yw2j7f.execute-api.eu-west-1.amazonaws.com/test/cakes/{id}

Example payload
```
{
  "name": "test-cake-new-name",
  "comment": "not nice",
  "imageUrl": "image100",
  "yumFactor": 3
}
```

DELETE - https://en62yw2j7f.execute-api.eu-west-1.amazonaws.com/test/cakes/{id}


### Source Control
The application is held in `git` source control and has had small regular commits added
during the course of development. The remote repository is available on Github.
### Framework/Architecture
I used the serverless framework, TypeScript, AWS and DynamoDb for the following reasons:
* The architecture provides a pure pay-for-usage model with no fixed overheads for the infrastructure and built-in scalability.
* Tight integration between Serverless, Lambda and Dynamo provides opportunities to
build out an event driven architecture (for example, using Dynamo Streams to version records in the
db) in the future.
* Serverless integrates directly with the AWS APIGateway, abstracting away the configuration of internet access to the
application, saving time in deployment.
* Ease of deployment - changes to the logic and data structure occur with a single
configuration file and CLI responsible for deployment.
* Lambda provides built-in fault tolerance, maintaining compute capacity across multiple Availability Zones in each region
 to help protect the application code against individual machine or data center facility failures.
* CORS implementation is straightforward with Serverless and Lambda, and has been implemented.
* Serverless provides straightforward compilation of TypeScript during the deployment process with the `serverless-plugin-typescript`.
Hence there is no specific `build` or `src` directory in the repo
* TypeScript was chosen because of the improved developer experience as well as the type safety provided.
* More generally NodeJS was chosen due to my personal familiarity, as well as the large developer base
ensuring that long-term maintainability is baked into the solution, excellent Lambda support for the language and its
built-in asynchronicity.
* A no-SQL db appeared most suitable for this application. There is no real relationship
between the records that need to be stored, other than the fact that they are all cakes. Therefore, an RDS
seemed overkill, adding complexity and configuration for what is essentially a list of documents.
* Linting is achieved through ESLint and Prettier with the applicable TS plugins.

Alternative architectures considered and discounted for this test were:
* Dockerised Express App + MongoDB container sitting on ECS / EKS
* Dockerised Express App + MongoDB container running on an EC2 instance

Both these options required more configuration to set up the required infrastructure and to allow public access to the 
application. There are also likely to be fixed costs with those architectures. With more time and a better understanding
of the long-term requirements for the application these architectures may be preferable. 

Disadvantages of a serverless / lambda architecture include issues with cold start times, managing db connection pools 
and a 15 minute timeout, so for extremely performant or long-running applications, it maybe better to consider the 
discounted architectures. 

However, speed to market to get initial feedback on the product is preferable to a perfect architecture from the get-go
in my opinion. Migrations can always occur once business models are proven and time and money is available. The agile way!
### Testing
The application has been unit and e2e tested to a limited extent. In the time available, I've added a basic e2e and unit
test suite to demonstrate skills in those areas. Coverage is not extensive at this point. I've picked the `POST /cakes` 
endpoint to test as it is one of the most complex. The e2e test suite calls the stage endpoints and writes to Dynamo. 
In real life, I would set up a separate test db stage and clean it down before each test to ensure the tests are isolated,
but time didn't allow for that level of complexity in this exercise. The unit tests use `sinon` to mock out the database
calls. Both suites are written in TS and can be run using the following commands, which use `ts-node` to compile the 
tests at runtime:

`npm run test:e2e` and `npm run test:unit`

### TODO
With more time, further validation could be added (for instance checking that the `imageUrl` is valid), improvements
could be made to test coverage, more refactoring of common code into shared helpers and adding of endpoint documentation
via Swagger or equivalent.

### Summary
Thanks for the opportunity to demonstrate my skills, I've enjoyed working on the exercise. Look forward to your feedback.
