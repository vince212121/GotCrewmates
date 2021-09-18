DROP DATABASE IF EXISTS GotCrewmates;
CREATE DATABASE GotCrewmates;
USE GotCrewmates;

DROP TABLE IF EXISTS PostStatus;
CREATE TABLE PostStatus (
	StatusID INT NOT NULL CONSTRAINT PK_StatusID PRIMARY KEY,
	Status VARCHAR(20) NOT NULL UNIQUE
);

INSERT INTO PostStatus (StatusID, Status)
VALUES 
	(1, 'Active'),
	(2, 'Inactive'),
	(3, 'Full');

DROP TABLE IF EXISTS Users;
CREATE TABLE Users (
	UserID SERIAL CONSTRAINT PK_UserID PRIMARY KEY,
	Username VARCHAR(25) NOT NULL UNIQUE,
	Hash CHAR(60) NOT NULL
);

DROP TABLE IF EXISTS Postings;
CREATE TABLE Postings (
	PostID SERIAL CONSTRAINT PK_PostID PRIMARY KEY,
	PostCreator INT NOT NULL CONSTRAINT FK_Postings_User_PostCreator REFERENCES Users(UserID),
	Title VARCHAR(50) NOT NULL,
	PostBody VARCHAR(1000) NOT NULL,
	NumberOfSpots INT NOT NULL,
	Status INT DEFAULT 1 NOT NULL CONSTRAINT FK_Postings_PostStatus_Status REFERENCES PostStatus(StatusID)
);

DROP TABLE IF EXISTS Tags;
CREATE TABLE Tags (
	TagID SERIAL CONSTRAINT PK_TagID PRIMARY KEY,
	TagName VARCHAR(50)
);

DROP TABLE IF EXISTS Groups;
CREATE TABLE Groups (
	PostID INT,
	UserID INT,
    CONSTRAINT FK_Groups_Postings_Post FOREIGN KEY (PostID) REFERENCES Postings(PostID),
    CONSTRAINT FK_Groups_Users_User FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

DROP TABLE IF EXISTS PostingTags;
CREATE TABLE PostingTags (
	PostID INT,
	TagID INT,
    CONSTRAINT FK_PostingTags_Postings_Post FOREIGN KEY (TagID) REFERENCES Tags(TagID),
    CONSTRAINT FK_PostingTags_Tags_Tag FOREIGN KEY (PostID) REFERENCES Postings(PostID)
);

INSERT INTO gotcrewmates.tags (tagname) VALUES 
('Music'),
('Photographing'),
('Art'),
('Cocktail'),
('DIY'),
('Woodworking'),
('Video Games'),
('Exercising'),
('Outdoors'),
('Karaoke'),
('Anime'),
('Movies'),
('Comics'),
('Travel'),
('Meditation'),
('Cars'),
('Gardening'),
('Programming'),
('Computer Hardware'),
('Hiking'),
('Swimming'),
('Camping'),
('Dancing'),
('Cooking'),
('Sports');

INSERT INTO gotcrewmates.users (username, hash) VALUES
('testuser', '$2b$10$sH3RDV2eD1EsB4STYXDx3.ZYA6ReKKQpU4qdHDI2pws5Srr8OzlOC');