
# Mini Twitter Application
Final project for CSc 322 - Software Engineering Fall 2023

# Team Members
Brandon Tjandra

## Specifications: 5 user Types
- [ ] Super-user (SU)
  - [ ] Can warn/add/delete any users and/or messages
- [ ] Corporate-user (CU)
  - [ ] Can post ads and job openings  
- [ ] Trendy-user (TU)
  - [ ] All permissions of an ordinary user (OU)
  - [ ] Subscribed by >10 users
  - [ ] Received >$100 tips or #likes-#dislikes > 10
  - [ ] Author of at least 2 trendy messages 
- [ ] Oridnary-user (OU)
  - [ ] Besides having all the features of a sufer, OU can post/delete, comment, tip, like/dislike, complain, follow messages, and subscribe to other users 
- [ ] Surfer
  - [ ] Can only view/search the messages and report/complain to the super-user about the misinformation 

## Each Message Features
- [ ] Carry the author. time, date, and up to 3 keywords chosen by the author
- [ ] Show the number of times others read it, number of likes/dislikes, and number of compliants
- [ ] If there are 1 or 2 tabooed words (Taboo word list is managed by SU), the words are changed to corresponding number of asterisks
  - [ ] If > 2 asterisks, the message is blocked automatically and the author is warned once automatically
- [ ] Any messages with >10 reads, #likes-#dislikes > 3 will be promoted to "trendy post" shown in the "trending tab"

## Required Features
- [ ] When a surfer visit the system, the top 3 most liked messages and the top 3 trendy-users will be featured in the top page.
  - [ ] Sufer is given the choice of applying to be an ordinary or corporate user with their chosen id
- [ ] The super-user processes user applications with accept or deny
  - [ ] If accept, a temporary password is sent to the user and the user must change it when they first log in and an amount of money should be desposited to the system
  - [ ] If denied, a justification should be provided
- [ ] When a TU/OU/CU logins, the system will sugest accounts for the user to follow based on this user's reading, liking, tipping, following history
- [ ] A TU/OU/CU can construct their own profiles which again is subjected to comments/reports by others (Same warning policy will apply if the profile contains misinformation)
- [ ] TU/OU can post messages with <= 20 words (An image is equivalent to 10 words while a video is equivalent to 15 words) for free
  - [ ] Any messages > 20 words will be billed byu the system automatically with the amount (# - 20) * $0.1
  - [ ] A CU's message is billed # * $1 without the free ones
  - [ ] If the user does not have enough money in the account, a warning is issued and when the user logging will be automatically directed to the payment page
- [ ] Any user receiving warning can dispute with the SU
  - [ ] If the dispute is won, the warning is removed
  - [ ] If the warning is initialized by another user, the user who reported/complained will be warned once
  - [ ] If the warning is by a surfer, the complained user is rewarded by 3 likes from the SU
  - [ ] Any CU/OU with 3 outstanding warnings will be given the choice of paying out the fine to remove the complaints or be removed from the system
  - [ ] Any TU with 3 oustanding warnings will be demoted to OU without any warnings
- [ ]  All users can search for messages based on author, keywords, with/without image and/or videos, # of likes/dislikes
- [ ]  CU is allowed to post ads and job applications that other can click and apply
  - [ ]  CU will pay the system (SU) by $0.1 for each click and application
- [ ]  Any TU/OU who post ads or job opportunites will be fined $10 and one warning
- [ ] Custom Features
