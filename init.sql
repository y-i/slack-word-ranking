create table aggregation (
  id int not null auto_increment primary key,
  word varchar(255) not null,
  type varchar(255) not null,
  count int not null default 0,
  day date not null,
  unique(word, type, day)
) DEFAULT CHARSET=utf8;
