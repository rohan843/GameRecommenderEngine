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

### Frontend Overview

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