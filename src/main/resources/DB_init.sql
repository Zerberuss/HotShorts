/*
drop table hotshorts.program;
drop table hotshorts.shortcut;
drop table hotshorts.version;
*/

#delete all columns
#DELETE FROM hotshorts.program WHERE length(name) > 0 
#truncate hotshorts.program

/*
#drop all tables (spring will create the tables from the entities when the application is started
drop TABLE hotshorts.shortcut;
drop TABLE hotshorts.version;
drop TABLE hotshorts.program;
*/

insert into hotshorts.program(name, description, website, rating_nr, rating_count, version)
values ('Visual Studio', 'Microsoft IDE for Writing C# and VB Applications', 'https://www.visualstudio.com/', 0, 0, 0);

insert into hotshorts.version(os_type, version_text, program, version)
values (0, 'Community 2015.2', 'Visual Studio', 0);

insert into hotshorts.version(os_type, version_text, program, version)
values (0, 'Community 2015 R1', 'Visual Studio', 0);

insert into hotshorts.version(os_type, version_text, program, version)
values (1, 'Community 2015.2.0', 'Visual Studio', 0);

/*
insert into hotshorts.shortcut(program_version, key_code, description, shortdescription, rating_count, rating_nr, version)
values (1, 'Strg + s', 'Save the document you have currently open in the IDE', 'save', 1, 4, 0);
*/

#http://stackoverflow.com/questions/10644149/insert-into-with-subquery-mysql
#now we always get the program_id of the visual studio:
INSERT INTO hotshorts.shortcut(program_version, key_code, description, shortdescription, rating_count, rating_nr, version)
  SELECT
    /* Literal number values with column aliases */
    id, #select the id from the version column where the program is "Visual Studio"
    'Strg + s' AS key_code,
    'Save the document you have currently open in the IDE' AS description,
    'save' AS shortdescription,
    1 AS rating_count,
    4 AS rating_nr,
    0 AS version
  FROM hotshorts.version
  WHERE program = 'Visual Studio';
#WHERE program = 'Visual Studio' - this would add the hotkey entry to all versions of Visual Studio which is very convenient
#if a hotkey applies to only one specific version, then write something like: WHERE program = 'Blender' AND version_text = '2.77'
#this has to be done like above, where the whole insert statement is a select query, else only 1 selected row is possible


INSERT INTO hotshorts.shortcut(program_version, key_code, description, shortdescription, rating_count, rating_nr, version)
  VALUES ((SELECT id from hotshorts.version WHERE program = 'Visual Studio' AND version_text = 'Community 2015.2'),
  'Strg + K + C',
  'Select one or more lines of code and change them into a comment',
  'comment out code',
  3,
  12,
  0);


insert into hotshorts.program(name, description, website, rating_nr, rating_count, version)
values ('Blender', 'Powerful Free Program for 3D Modeling and Animtion', 'https://www.blender.org/', 40, 12, 0);

insert into hotshorts.version(os_type, version_text, program, version)
values (0, '2.77', 'Blender', 0);

insert into hotshorts.version(os_type, version_text, program, version)
values (0, '2.78a', 'Blender', 0);

INSERT INTO hotshorts.shortcut(program_version, key_code, description, shortdescription, rating_count, rating_nr, version)
VALUES ((SELECT id from hotshorts.version WHERE program = 'Blender' AND version_text = '2.77'),
        'SHIFT-F5',
        'Change the window to a 3D Window',
        '3D Window Toggle',
        2,
        10,
        0);

INSERT INTO hotshorts.shortcut(program_version, key_code, description, shortdescription, rating_count, rating_nr, version)
VALUES ((SELECT id from hotshorts.version WHERE program = 'Blender' AND version_text = '2.77'),
        'CTRL-W',
        'This key combination allows you to write the Blender file without opening a FileWindow',
        'Write file',
        5,
        18,
        0);



#add this hotkey to all versions of blender that exist as of the execution of this query
INSERT INTO hotshorts.shortcut(program_version, key_code, description, shortdescription, rating_count, rating_nr, version)
  SELECT
    /* Literal number values with column aliases */
    id, #select the id from the version column where the program is "Visual Studio"
    'SPACE' AS key_code,
    'Open the Toolbox' AS description,
    'Toolbox' AS shortdescription,
    4 AS rating_count,
    18 AS rating_nr,
    0 AS version
  FROM hotshorts.version
  WHERE program = 'Blender';


INSERT INTO hotshorts.shortcut(program_version, key_code, description, shortdescription, rating_count, rating_nr, version)
VALUES ((SELECT id from hotshorts.version WHERE program = 'Blender' AND version_text = '2.78a'),
        'RIGHTARROW',
        'Go to the next frame',
        'next frame',
        2,
        7,
        0);
