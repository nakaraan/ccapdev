CREATE TABLE User (
	user_id int, 
    first_name varchar(32),
    last_name varchar(32),
    user_password varchar(32),
    user_role ENUM('Student', 'Admin'),
    email_address varchar(100),
    PRIMARY KEY (id)
);

CREATE TABLE Profile (
    user_description varchar(255),
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (first_name) REFERENCES User(first_name),
    FOREIGN KEY (last_name) REFERENCES User(last_name),
    FOREIGN KEY (user_role) REFERENCES User(user_role)
);

CREATE TABLE Reservations(
    reservation_id int PRIMARY KEY,
	reservation_date date,
    seat_number int,
    reservation_status ENUM('Pending', 'Confirmed', 'Cancelled', 'Completed'),
    FOREIGN KEY (room_number) references Laboratory(room_number),
    FOREIGN KEY (user_id) references User(user_id),
);

CREATE TABLE Laboratory (
	FOREIGN KEY (reservation_id) references Reservations(reservation_id),
    room_number varchar(32), /* ex. GK503 */
    slots_occupied int,
    slots_total int,
    slot_status ENUM('Vacant', 'Reserved')
);
