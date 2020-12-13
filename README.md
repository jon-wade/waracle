#Waracle-Test
###Endpoints
GET - https://en62yw2j7f.execute-api.eu-west-1.amazonaws.com/test/cakes

GET - https://en62yw2j7f.execute-api.eu-west-1.amazonaws.com/test/cakes/{id}

POST - https://en62yw2j7f.execute-api.eu-west-1.amazonaws.com/test/cakes

PUT - https://en62yw2j7f.execute-api.eu-west-1.amazonaws.com/test/cakes/{id}

DELETE - https://en62yw2j7f.execute-api.eu-west-1.amazonaws.com/test/cakes/{id}


###Source Control
The application is held in `git` source control and has had small regular commits added
during the course of development. The remote repository is available on Github.
###Framework/Architecture
I used the serverless framework, TypeScript, AWS and DynamoDb for the following reasons:
* The architecture provides a pure pay-for-usage model with no fixed overheads for the infrastructure and built-in scalability.
* Tight integration between Serverless, Lambda and Dynamo provides opportunities to
build out an event driven architecture (for example, using Dynamo Streams to version records in the
db).
* Serverless integrates directly with the AWS APIGateway, abstracting away the configuration of internet access to the
application, saving time in deployment.
* Ease of deployment - changes to the logic and data structure occur with a single
configuration file and CLI responsible for deployment.
* Lambda provides built-in fault tolerance, maintaining compute capacity across multiple Availability Zones in each region
 to help protect the application code against individual machine or data center facility failures.
reducing runtime bugs and issues.
* CORS implementation is straightforward with Serverless and Lambda.
* Serverless provides straightforward compilation of TypeScript during the deployment process.
* TypeScript was chosen because of the improved developer experience as well as the type safety provided.
* More generally NodeJS was chosen due to my personal familiarity, as well as the large developer base
ensuring that long-term maintainability is baked into the solution, as well as excellent Lambda support for the language.
* A no-SQL db appeared most suitable for this application. There is no real relationship
between the records that need to be stored, other than the fact that are all cakes. Therefore a RDS
seemed overkill, adding complexity and configuration for what is essentially a list of documents.

Alternative architectures considered and discounted for this test were:
* Dockerised Express App + MongoDB container sitting on ECS / EKS
* Dockerised Express App + MongoDB container running on an EC2 instance

Both these options required more configuration to set up the required infrastructure and to allow public access to the 
application. With more time and a better understanding of the long-term requirements for the application these architectures
may be preferable. 

Disadvantages of a serverless architecture include issues with cold start times,
managing db connection pools and a 15 minute timeout, so for extremely performant or long-running applications, it may
be better to consider the discounted architectures. 

However, speed to market to get initial feedback on the product is
preferable to a perfect architecture from the get-go in my opinion. Migrations can always occur once business models are 
proven and time and money is available. The agile way!
###Testing
The application has been unit and e2e tested. In the time available, I've added a basic e2e and unit test suite to
demonstrate skills in those areas. Coverage is not extensive at this point, and would be improved with more time. I've
picked the most complex endpoints to test, taking an approach of coverage at the points of greatest risk rather than
chasing a coverage target.
###Summary
Thanks for the opportunity to demonstrate my skills, I've enjoyed working on it. Look forward to your feedback.
