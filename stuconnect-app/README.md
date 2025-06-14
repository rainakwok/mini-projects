# StuConnect

## Project Description
StuConnect is a student networking platform designed to facilitate meaningful professional connections among students, professionals, mentors, and potential employers. Unlike conventional networking platforms, StuConnect emphasizes instant connections based on user-provided information such as interests, goals, and future aspirations during account creation. The platform aims to streamline the networking process, eliminate cluttered message inboxes, and provide users with a direct and prompt means of communication.

## Background Information
StuConnect focuses on matching users based on their interests, goals, and future aspirations rather than being constrained by their past and current experiences. It offers a user-friendly interface with features such as sign-up/login, profile setup, discovery page with filtering and sorting options, events page, availability scheduling, and more. Users can customize their profiles, indicate interest in connecting with others, and schedule coffee chats seamlessly.

## Sample Input Data
- User profiles with first and last name, username, password, school, school email, bio, interests, aspirations, availability, profile picture, and region.
- Job data retrieved from the back4app 'Occupations and Job Titles' database (https://www.back4app.com/database/back4app/occupations-and-job-titles/get-started/node-js/rest-api/node-fetch?objectClassSlug=job)
- Sample existing accounts
  - Emails: test123@gmail.com, test1@gmail.com, test2@gmail.com, ..., test11@gmail.com
  - Password: Password123!


## User Stories
StuConnect implements a variety of user stories to enhance the networking experience. Newly registered users can easily set up their profiles to begin matching with others, view cards of matched individuals, and indicate interest in connecting with them. Users have the ability to manage their connections, sign up or log in using either username/password or Google account credentials, and recover forgotten passwords. They can also edit their profile details, filter and sort profiles on the Discovery page, and invite connections to events. Real-time notifications keep users informed, while options to categorize connections, delete accounts, and reset interests/aspirations ensure flexibility and privacy. Additionally, users can customize views and layouts to tailor their networking experience according to their preferences.

## Limitations
- Limitations exist with the free plans of Calendly and SerpApi.
  - Calendly free plan restrictions include 1 event type and 1 calendar connection per person.
  - SerpApi free plan limits the server to 100 searches per month.
