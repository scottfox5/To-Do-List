CREATE DATABASE to_do_list_db;

CREATE TABLE tasks (
	id SERIAL PRIMARY KEY,
	task VARCHAR (80),
	complete BOOLEAN DEFAULT FALSE,
	notes TEXT,
	updated TIMESTAMP,
	list_id INT
);

INSERT INTO tasks (task,complete,notes,updated,list_id)
VALUES ('example1',false,'example details 1','2017-02-23 23:00:00', 1);

INSERT INTO tasks (task,complete,notes,updated,list_id)
VALUES ('example2',false,'example details 2','2017-01-20 06:30:00', 1);
