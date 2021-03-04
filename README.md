# Statistical Region Merging
Statistical region merging (SRM) is an algorithm used for image segmentation. The algorithm is used to evaluate the values within a regional span and grouped together based on the merging criteria, resulting in a smaller list. Some useful examples are creating a group of generations within a population, or in image processing, grouping a number of neighboring pixels based on their shades that fall within a particular threshold (Qualification Criteria).

## About this project

The point of this project is to create a web-app to allow users to upload images and perform segmentation with the SRM algorithm.

## How to run it

You can either run it with Docker or with NPM.

### Docker

You must have docker installed on your machine.

To run it with docker just run the following code:

```
docker run -d -p 8080 mirkesx/web_srm
```

Then you reach the web-app at the following url http://localhost:32768 (the port could vary depending on docker).

### NPM

You need to install beforehand:
<ol>
  <li>npm (I used version 12)</li>
  <li>Python (I used version 3.6)</li>
  <li>Python packages such as numpy and opencv-python
</ol>

Clone this repo, reach the main folder of the repo and to install the npm packages with:

```
npm install
```

Then you can run it by sending the command:

```
npm run start
```


## References
<ol>
  <li>https://en.wikipedia.org/wiki/Statistical_region_merging</li>
  <li>http://www1.univ-ag.fr/~rnock/Articles/Drafts/tpami04-nn.pdf</li>
  <li>https://github.com/Ankitdulani/srm</li>
  <li>https://hub.docker.com/repository/docker/mirkesx/web_srm</li>
</ol>
