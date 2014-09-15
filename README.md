Twitch-Extension
================
This is a chrome extension that lists all the followed channels for a given username.  Username persists between popups.  Clicking channel opens it in new tab.

Does not direclty use Twitch Javascript API, because Google security policy doesn't allow non-local script calls.  Instead, it accesses the URLs the API would access and then manually parses the text.

Looks like: http://i.imgur.com/D2qIyn0.png?1
