# HumanProtocol
HumanProtocol is a simple protocol,written in JS, that can be used for building other protocols! All comands are human-readable in HumanProtocol.

# Why?
You can use it as base for writting your own protocol.

# List of commands

### Hello
Start authentication

### Bye

Close connection
# List of responses

## Hello / Bye

```Hello``` / ```See you later!```

## Authentication - Enter username

```Who are you?```

## Authentication - Enter password

```Okay, now, what's your passphrase?```

## Authentication - Unknown user

```Who are you? If you don't say the proper name (maxAuthAttempts-failedAttempts) more times, I will end you right now.```

## Authentication - Invalid password

```What's your passphrase? If you don't say the proper passphrase (maxAuthAttempts-failedAttempts) more times, I will end you right now.```

## No authentication attempts left

```Get lost, idiot.```
(connection ends)

## Logged in, but got "Hello" again

```Are you ok?```

## Got "Hello", after "Hello"

```Are you ok? Please answer the previous question!```

## Got unknown command, while not waiting for input

```Sorry, i did not understood you.```

## Got unknown command

```Sorry?```

# Settings

Settings are stored in ```./settings.json``` as JSON object.

Example settings file: 
```
{
"port":8080, 
"guestAccess":0,
"users":["emil"], 
"passwords":["6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b"],
"authAttempts":"3"
}
```
Example user data for logging in:
```
Username: "emil",
Password: "1"

```

```port``` - Integer from 0 to 65535, TCP socket port.

```guestAccess``` - Integer, if set to 0 - password is required, else - "passwords" list is not nessecary, and everyone in "users" list can log in without password.

```users``` - List with usernames(strings).

```passwords``` - List with user's passwords(strings). Index of user is index of a password in the list. Every password is a SHA256 hash

```authAttempts``` - Integer, maximum authentication failures. Used both for entering username and for entering password.



