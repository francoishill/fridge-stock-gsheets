# fridge-stock-gsheets

A google sheets script to notify you of almost expired (and already expired) items in your fridge


## Quick start

* Make a copy of the [Example of Fridge Stock](https://docs.google.com/spreadsheets/d/1XEEyYlTXiiwtLlZDcA34AQBatjcPsxBLbn9Byp4eBHg/edit?usp=sharing)
* Choose [Tools -> Script editor] from the sheet's mene
  * The script should be copied from the example with two functions, namely `buildHtmlTable` and `emailExpiredStock`
* Work through the `//TODO:` comments at the top of the `Code.gs` file (recipients, sheetId)
* From the toolbar above the script, select `emailExpiredStock` in the dropdown and then click Run
* Grant permissions
  * When prompted with a "Authorization required" dialog, click "Review permissions" and choose your Google user
  * When you land at "This app isn't verified", click "Advanced" and then "Go to Fridge Stock Project (unsafe)"
  * When you land at "Fridge Stock Project wants to access your Google Account", click "Allow" at the bottom right
* Setup a trigger
  * In the script editor menu click [Edit -> Current project's triggers]
  * Click to create/add a new trigger
  * Select `emailExpiredStock` as the function, "Head" as the deployment
  * Decide on your preference to fire, I prefer [Time-driven -> Day timer -> 7am to 8am] trigger
  * Choose your preference in "Failure notification settings", I prefer "Notify me immediately"


## Source code

This github repository contains a copy of the `Code.gs` file which has the same content as in the "Example of Fridge Stock".