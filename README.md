![chitChatLogo](https://github.com/btjandra15/ChitChatWebsite/assets/48455670/e9b87b73-ce25-4638-abef-477a21491c77)
# Team Members
Brandon Tjandra, Sohail Ahmad, Muhammad Rahman, Md Wasiul Islam, Pretam Chowdhury

## Specifications: 5 user Types
- [x] Super-user (SU)
  - [x] Can warn/add/delete any users and/or messages
- [x] Corporate-user (CU)
  - [x] Can post ads and job openings  
- [x] Trendy-user (TU)
  - [x] All permissions of an ordinary user (OU)
  - [x] Subscribed by >10 users
  - [x] Received >$100 tips or #likes-#dislikes > 10
  - [x] Author of at least 2 trendy messages 
- [x] Oridnary-user (OU)
  - [x] Besides having all the features of a surfer, OU can post/delete, comment, tip, like/dislike, complain, follow messages, and subscribe to other users 
- [x] Surfer
  - [x] Can only view/search the messages and report/complain to the super-user about the misinformation 

## Each Message Features
- [x] Carry the author. time, date, and up to 3 keywords chosen by the author
- [x] Show the number of times others read it, the number of likes/dislikes, and the number of complaints
- [x] If there are 1 or 2 tabooed words (Taboo word list is managed by SU), the words are changed to the corresponding number of asterisks
  - [x] If > 2 asterisks, the message is blocked automatically, and the author is warned once automatically
- [x] Any messages with >10 reads, #likes-#dislikes > 3 will be promoted to "trendy post" shown in the "trending tab"

## Required Features
- [x] When a surfer visits the system, the top 3 most liked messages and the top 3 trendy users will be featured on the top page.
  - [x] Sufer is given the choice of applying to be an ordinary or corporate user with their chosen id
- [x] The super-user processes user applications with accept or deny
  - [x] If accepted, a temporary password is sent to the user and the user must change it when they first log in and an amount of money should be deposited to the system
  - [x] If denied, a justification should be provided
- [x] When a TU/OU/CU logins, the system will suggest accounts for the user to follow based on this user's reading, liking, tipping, following history
- [x] A TU/OU/CU can construct their profiles which again are subjected to comments/reports by others (Same warning policy will apply if the profile contains misinformation)
- [x] TU/OU can post messages with <= 20 words (An image is equivalent to 10 words while a video is equivalent to 15 words) for free
  - [x] Any messages > 20 words will be billed by the system automatically with the amount (# - 20) * $0.1
  - [x] A CU's message is billed # * $1 without the free ones
  - [x] If the user does not have enough money in the account, a warning is issued, and when the user logging will be automatically directed to the payment page
- [x] Any user receiving a warning can dispute with the SU
  - [x] If the dispute is won, the warning is removed
  - [x] If the warning is initialized by another user, the user who reported/complained will be warned once
  - [x] If the warning is by a surfer, the complained user is rewarded with 3 likes from the SU
  - [x] Any CU/OU with 3 outstanding warnings will be given the choice of paying out the fine to remove the complaints or be removed from the system
  - [x] Any TU with 3 outstanding warnings will be demoted to OU without any warnings
- [x]  All users can search for messages based on author, keywords, with/without images and/or videos, # of likes/dislikes
- [x]  CU is allowed to post ads and job applications that others can click and apply
  - [x]  CU will pay the system (SU) by $0.1 for each click and application
- [x]  Any TU/OU who posts ads or job opportunities will be fined $10 and one warning
- [x] Custom Features
  - [x] User can turn on or off dark mode and saves the choice even when the user reloads the page
  - [x] Most liked posts on the right bar will show a preview if they have an image or video 
