CREATE TABLE User (
	id int, 
    first_name varchar(32),
    last_name varchar(32),
    username varchar(32),
    password varchar(32),
    PRIMARY KEY (user_id)
);

CREATE TABLE Admin (
	id int,
    first_name varchar(32),
    last_name varchar(32),
    PRIMARY KEY (admin_id)
);

CREATE TABLE Reservations(
	reservation_date date,
    laboratory varchar(32),
    FOREIGN KEY (user_id) references User(id),
    FOREIGN KEY (admin_id) references Admin(id)
);

CREATE TABLE Laboratory (
	reservation_id int,
    room_number varchar(32),
    slots ENUM('Vacant', 'Reserved')
);

