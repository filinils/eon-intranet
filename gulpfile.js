/*
  gulpfile.js
  ===========
  Rather than manage one giant configuration file responsible
  for creating multiple tasks, each task has been broken out into
  its own file in gulp/tasks. Any files in that directory get
  automatically required below.
  To add a new task, simply add a new task file that directory.
  gulp/tasks/default.js specifies the default set of tasks to run
  when you run `gulp`.
*/

var requireDir = require('require-dir');

// Require all tasks in gulp-tasks, including subfolders
requireDir('./gulp/tasks', { recurse: true });


/*
Tasks
===== 

First time:
> gulp install

While developing:
> gulp 

Delete all builds:
> gulp clean

To generate styleguide:
> gulp styleguide
> gulp --site styleguide

To deploy to public server: 
> gulp deploy

To deploy styleguide:
> gulp deploy --site styleguide


Settings
========
All settings reside in gulp/config.js

*/
