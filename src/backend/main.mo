import Time "mo:core/Time";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  type AccountId = Nat;
  type MessageId = Nat;
  type PostId = Nat;

  public type SocialMediaAccount = {
    id : AccountId;
    name : Text;
    platform : Text;
    status : Text;
    email : Text;
    clientName : Text;
    lastActivity : Int;
  };

  public type Message = {
    id : MessageId;
    accountId : AccountId;
    sender : Text;
    subject : Text;
    preview : Text;
    platform : Text;
    timestamp : Int;
    isRead : Bool;
    isStarred : Bool;
  };

  public type Post = {
    id : PostId;
    content : Text;
    targetAccountIds : [AccountId];
    status : Text;
    createdAt : Int;
  };

  public type DashboardStats = {
    totalAccounts : Nat;
    activeCount : Nat;
    disconnectedCount : Nat;
    unreadMessageCount : Nat;
  };

  public type UserProfile = {
    name : Text;
  };

  // Persistent Storage
  var nextAccountId : AccountId = 1;
  var nextMessageId : MessageId = 1;
  var nextPostId : PostId = 1;

  let accounts = Map.empty<AccountId, SocialMediaAccount>();
  let messages = Map.empty<MessageId, Message>();
  let posts = Map.empty<PostId, Post>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Account Management
  public shared ({ caller }) func createAccount(account : SocialMediaAccount) : async AccountId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create accounts");
    };

    let newId = nextAccountId;
    nextAccountId += 1;

    let newAccount : SocialMediaAccount = {
      account with
      id = newId;
      lastActivity = Time.now();
    };

    accounts.add(newId, newAccount);
    newId;
  };

  public query ({ caller }) func getAccount(accountId : AccountId) : async SocialMediaAccount {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view accounts");
    };

    switch (accounts.get(accountId)) {
      case (null) { Runtime.trap("Account not found") };
      case (?account) { account };
    };
  };

  public shared ({ caller }) func updateAccountStatus(accountId : AccountId, newStatus : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update account status");
    };

    switch (accounts.get(accountId)) {
      case (null) { Runtime.trap("Account not found") };
      case (?account) {
        let updatedAccount : SocialMediaAccount = {
          account with
          status = newStatus;
          lastActivity = Time.now();
        };
        accounts.add(accountId, updatedAccount);
      };
    };
  };

  public shared ({ caller }) func deleteAccount(accountId : AccountId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete accounts");
    };

    accounts.remove(accountId);
  };

  public query ({ caller }) func listAccounts(accountId : AccountId) : async [SocialMediaAccount] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list accounts");
    };

    accounts.values().toArray();
  };

  // Message Management
  public shared ({ caller }) func createMessage(message : Message) : async MessageId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create messages");
    };

    let newId = nextMessageId;
    nextMessageId += 1;

    let newMessage : Message = {
      message with
      id = newId;
      timestamp = Time.now();
    };

    messages.add(newId, newMessage);
    newId;
  };

  public query ({ caller }) func getMessage(messageId : MessageId) : async Message {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view messages");
    };

    switch (messages.get(messageId)) {
      case (null) { Runtime.trap("Message not found") };
      case (?message) { message };
    };
  };

  public query ({ caller }) func listMessages(startFrom : Nat, pageSize : Nat) : async [Message] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list messages");
    };

    let messageArray = messages.values().toArray();

    if (messageArray.size() == 0) { return [] };
    let fromIdx = Nat.min(startFrom, messageArray.size() - 1);
    let toIdx = if (fromIdx + pageSize >= messageArray.size()) {
      messageArray.size() - 1;
    } else { fromIdx + pageSize };
    Nat.range(fromIdx, toIdx).toArray().map(func(i) { messageArray[i] });
  };

  public query ({ caller }) func listMessagesByAccount(accountId : AccountId) : async [Message] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list messages");
    };

    messages.values().toArray().filter(
      func(msg) {
        msg.accountId == accountId;
      }
    );
  };

  public shared ({ caller }) func markMessageRead(messageId : MessageId, isRead : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark messages as read");
    };

    switch (messages.get(messageId)) {
      case (null) { Runtime.trap("Message not found") };
      case (?message) {
        let updatedMessage : Message = {
          message with
          isRead;
        };
        messages.add(messageId, updatedMessage);
      };
    };
  };

  public shared ({ caller }) func markMessageStarred(messageId : MessageId, isStarred : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can star messages");
    };

    switch (messages.get(messageId)) {
      case (null) { Runtime.trap("Message not found") };
      case (?message) {
        let updatedMessage : Message = {
          message with
          isStarred;
        };
        messages.add(messageId, updatedMessage);
      };
    };
  };

  public query ({ caller }) func getUnreadCount() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get unread count");
    };

    messages.values().toArray().filter(
      func(msg) {
        not msg.isRead;
      }
    ).size();
  };

  // Post Management
  public shared ({ caller }) func createPost(post : Post) : async PostId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create posts");
    };

    let newId = nextPostId;
    nextPostId += 1;

    let newPost : Post = {
      post with
      id = newId;
      status = "draft";
      createdAt = Time.now();
    };

    posts.add(newId, newPost);
    newId;
  };

  public query ({ caller }) func getPost(postId : PostId) : async Post {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view posts");
    };

    switch (posts.get(postId)) {
      case (null) { Runtime.trap("Post not found") };
      case (?post) { post };
    };
  };

  public query ({ caller }) func listPosts() : async [Post] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list posts");
    };

    posts.values().toArray();
  };

  public shared ({ caller }) func updatePostStatus(postId : PostId, newStatus : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update post status");
    };

    switch (posts.get(postId)) {
      case (null) { Runtime.trap("Post not found") };
      case (?post) {
        let updatedPost : Post = {
          post with
          status = newStatus;
        };
        posts.add(postId, updatedPost);
      };
    };
  };

  // Dashboard Stats
  public query ({ caller }) func getDashboardStats() : async DashboardStats {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view dashboard stats");
    };

    let totalAccounts = accounts.values().toArray().size();
    let activeCount = accounts.values().toArray().filter(
      func(acct) {
        acct.status == "active"
      }
    ).size();
    let disconnectedCount = accounts.values().toArray().filter(
      func(acct) {
        acct.status == "disconnected"
      }
    ).size();
    let unreadMessageCount = messages.values().toArray().filter(
      func(msg) {
        not msg.isRead
      }
    ).size();

    {
      totalAccounts;
      activeCount;
      disconnectedCount;
      unreadMessageCount;
    };
  };

  // Data Seeding (call once at init) - Admin only
  public shared ({ caller }) func seedData() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can seed data");
    };

    if (accounts.isEmpty() and messages.isEmpty()) {
      let platforms = ["Twitter", "Facebook", "Instagram", "LinkedIn"];
      let clientNames = ["Acme Corp", "Globex", "Initech", "Umbrella"];

      // Seed accounts
      for (i in Nat.range(0, 20)) {
        let account : SocialMediaAccount = {
          id = nextAccountId;
          name = "Account #" # i.toText();
          platform = platforms[i % platforms.size()];
          status = if (i % 5 == 0) { "disconnected" } else { "active" };
          email = "account" # i.toText() # "@example.com";
          clientName = clientNames[i % clientNames.size()];
          lastActivity = Time.now() - (i * 86400).toInt();
        };
        let newId = nextAccountId;
        nextAccountId += 1;
        accounts.add(newId, account);
      };

      // Seed messages
      for (i in Nat.range(0, 30)) {
        let message : Message = {
          id = nextMessageId;
          accountId = (i % 20) + 1;
          sender = "user" # i.toText() # "@gmail.com";
          subject = "Message Subject " # i.toText();
          preview = "This is a preview for message " # i.toText();
          platform = platforms[i % platforms.size()];
          timestamp = Time.now() - (i * 3600).toInt();
          isRead = i % 4 != 0;
          isStarred = i % 7 == 0;
        };
        let newId = nextMessageId;
        nextMessageId += 1;
        messages.add(newId, message);
      };
    };
  };
};
