# Game Recommender System

This project has been created to demonstrate the use and applications of game recommender systems, and the algorithms that go into creating them.

## System Overview

### System Architecture Overview

The following diagram illustrates how the various components of the system are interlinked:

![system architecture](Docs/OverallArch.jpg)

The Web Server serves the web pages to the user's computer. These pages are rendered using ejs in the backend, as explained later. The data for this task comes from the recommender API server, and from the database.

The user interacts with the frontend, where a JS script monitors user activity. This script creates objects, which are called **UserActions**. These are sent to the web server, which sends them to the DB Modifier server. More on this is covered later.

The DB Modifier is responsible for 2 tasks:

1. Resolving UserActions to reflect changes in the database.
2. Causing the recommender to be updated to reflect the latest state of the DB, from time to time. 

The Recommender server is the server that analyses the behaviour of users, and based on the user profile, game profiles, and user - game interactions, provides recommendations. It provides an API based interface for this. The interface, and the internal workings of the recommender are described below.

### Database Overview

The database cluster consists of **2 NoSQL Databases**:

1. recommenderDb: It contains the data primarily used by the recommender. It has the following 4 collections:

    1. allGameData: Info about games.
    2. allUserData: Info about users.
    3. gameFeatures: Game Profiles.
    4. userGameInteractions: Info about interaction between users and games, with an implicit rating per interaction.
2. sysDB: It contains the data required for the system to work, but not used for recommender predictions. Its collections are:

    1. featuredGames: The ids of 4 games chosen manually to be 'Editor's Choice' games.
    2. genres: The list of genres in the system, along with their ids.
    3. mergeByAndCodes: The numbers that denote a genre search merger by AND (see the section on Genre Based Search below).
    4. modelRefreshPasswords: The valid passwords that can be used to cause the recommendet to be refreshed.
    5. userGameBehaviour: The information that is received by monitoring how users interact with games.
    6. userGenreBehaviour: The information that is received by monitoring how users interact with genres.

### Frontend Overview

The frontend, i.e., the website serves as a way to display information about games, and also as a method to monitor how the user interacts with games and genres, to fine tune the recommendations.

## Demo Specific Featues

## Website Navigation

### Quick Start

### Home Page

### Community Stats Page

### Similar User Page

### Store Page

### Catalog Page

### Owned Games Page

### Signins

### Genre Based Search

## Recommender API Server Documentation

### Server Specific Documentation

### Recommender Module

## DBModify Server Documetation

### New User Refresh

### User Monitoring and UserActions

## Web Server Documentation

### Database Related Functions

### Recommender Related Functions

### Server Routes

### Caching

#### Recommender Cache

#### Database Caches