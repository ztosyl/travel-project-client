### Travel Project Client

This app is a travel planning app. A user is able to log on, post a plan to take a trip, and then click on that trip to add itinerary items. The client is hooked up to two third-party APIs, one which returns live flight data and one which returns live hotel data, and the user can use those to complete their plans when creating them. A quick note: as of now, the hotel data includes already booked hotels. This was done for testing/display purposes, because it is extremely difficult to find hotels on the database that aren't already booked (the queries often turned up empty.)

## Repo Links

[Client](https://github.com/ztosyl/travel-project-client)
[API](https://github.com/ztosyl/travel-project-api)

## Deployed Links

[Client](https://ztosyl.github.io/travel-project-client)
[API](https://travel-project-api.herokuapp.com)

## Technologies Used

For styling I used HTML, CSS, React Bootstrap and SASS.

The client is a React app, and all DOM manipulation and routing is done using React.

API calls are made using Axios, and the QS library is used with one axios call to handle sending url encoded data to Amadeus.

The third-party APIs used are both Amadeus self-service APIs, the Flight Offers and Hotel Offers API. There is a 3,000/mo call limit for each of those APIs.


## Improvements

### Categorize Itineraries by Day
In a future version of this project, I'd like to be able to group itinerary items by day. They are currently in order by time, however not grouped beyond that, and I think it would make sense to have them clustered by what day they are on. This may even include an intermediate page or accordion where the user could click on a day and see what they had planned for that day.

### Amadeus Point of Interest API integration
In addition to the Flights and Hotels APIs, Amadeus also has a Point of Interest API, which I think could be interesting to integrate on the Itinerary side.

### Maps integration
I'd also like to integrate some kind of maps API, that could give a user directions from the airport to the hotel, or the hotel to a point of interest.

## Development/Problem Solving Process

Before I started on the front end, I made sure the API was fully functional. After the first complete working version of the API, I did not change it.

I started every part of this project making sure the API calls worked properly. If i could call to the API and get a response I was expecting, then I worked on how best to display the data. I think the accordion works well for this because it makes it easy to skim through data on the top level, and find what it is you're actually looking for to look at it in more detail.

I worked on it api call by api call, get, then post, then delete... etc. And then after Plans were fully cruddable I moved on to creating and crudding the Itinerary component.

After those parts were complete, I integrated third party API data. This is where QS became essential, because Amaedeus requires you to generate a token to make requests and that token can only be generated by sending url encoded data to its authentication server. This is impossible without using axios on its own, and the QS library helped me send that data properly. Getting this to work required lots of console logging and narrowing down the issue to where in the API it was having the problem. Since each Amadeus call required two steps, it was extremely helpful to narrow down to which of those two steps was causing the issue, and then double check what I was sending to the API.

A lot of logic in this app involves some object-based states. I ran into an issue while doing this project where I was unsure how to keep track of information on many different 'plans' at one time. The solution I devised to this was to create a state object, and store information about each plan on that object as the value of a key that was equal to that plan's id. Therefore, there wasn't a separate state per object, but the info was saved and relatively easy to access when necessary.

## User Stories

### MVP
As a user, I'd like to create a new trip plan.
As a user, I'd like to add itinerary items to the plan.
As a user, I'd like to remove itinerary items from the plan.
As a user, I'd like to be able to access and edit old plans.
As a user, I'd like to be able to delete a plan.

### Stretch:
As a user, I'd like to be presented with flight information for my dates to add a flight to my plan.
As a user, I'd like to be presented with hotel information for my dates to add a hotel to my plan.
As a user, I'd like to see info on points of interest near my destination.

## Wireframe

[Wireframe](https://media.git.generalassemb.ly/user/27606/files/09f57800-b465-11ea-8644-052fe632d8f8)

## App Screenshots
![Travel Plans](https://i.imgur.com/nODCHsh.png)
![Itinerary](https://i.imgur.com/JR2WF6J.png)
![Available Flights](https://i.imgur.com/1uvreQl.png)

### Installation

To install this repo, fork it and then git clone into your local system, and run npm install to install dependencies. The keys for Amadeus are mine and they're active, so there should be no issues using them.
