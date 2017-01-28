CREATE DATABASE to_do_list_db;

CREATE TABLE tasks (
	id SERIAL PRIMARY KEY,
	task VARCHAR (80),
	complete BOOLEAN NOT NULL DEFAULT FALSE,
	notes TEXT,
	updated TIMESTAMP,
	list_id INT
);

INSERT INTO tasks (task,complete,notes,updated,list_id)
VALUES ('get groceries',false,'apples bananas milk eggs bread','2017-02-23 23:00:00', 1);

INSERT INTO tasks (task,complete,notes,updated,list_id)
VALUES ('excercise',false,'intervals kettle bells planks burpees pull-ups','2017-01-20 06:30:00', 1);
