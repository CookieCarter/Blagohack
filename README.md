## Blagohack
A continuation of [Interhack](https://github.com/TAEB/Interhack) written in Javascript for the alt.org nethack [online terminal](https://www.alt.org/nethack/hterm/).

The script can be loaded by either pasting all the scripts you want into the console or by using the extension option in web browsers.

### Loading
To load this script in firefox, zip the entire project and then go to [about:debugging#/runtime/this-firefox](about:debugging#/runtime/this-firefox) and click "Load Temporary Add-on...", then select the zip file.

To load this in chrome go to [about:extensions](about:extensions), enable developer mode and click "Load unpacked", then select the folder containing this project.

### Password
Your password is stored in local storage which is not very secure. You can set your username and password using the following commands.

```js
localStorage.setItem("username", "example_username");
localStorage.setItem("password", "example_password");
```

You can set only your username and it will still enter that automatically.

### Usage
Check the Javascript files for more info on what functionality is added.