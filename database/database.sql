CREATE DATABASE "SCChileDB";

CREATE TABLE guardia(
    idguardia VARCHAR PRIMARY KEY,
    nombre VARCHAR,
    email VARCHAR,
    password VARCHAR,
    rut VARCHAR(9),
    tipo VARCHAR
);

CREATE TABLE vecino(
    idvecino VARCHAR PRIMARY KEY,
    direccion VARCHAR,
    password VARCHAR,
    telefono NUMERIC(9),
    estado VARCHAR
);

CREATE TABLE vecino_contacto(
    vecino_idvecino VARCHAR,
    contacto_telefono NUMERIC(9)
);

CREATE TABLE contacto(
    telefono NUMERIC(9) PRIMARY KEY,
    nombre VARCHAR(40)
);

alter table vecino_contacto
    add constraint FK_vecino_idvecino_vecinocontacto
    foreign key (vecino_idvecino)
    references vecino(idvecino)
    on update CASCADE
    on delete CASCADE;

alter table vecino_contacto
    add constraint FK_contacto_telefono_vecinocontacto
    foreign key (contacto_telefono)
    references contacto(telefono)
    on update CASCADE
    on delete CASCADE;

CREATE TABLE alarma(
    idalarma SERIAL PRIMARY KEY,
    vecino_idvecino VARCHAR,
    guardia_idguardia VARCHAR,
    fecha TIMESTAMP,
    estado VARCHAR,
    comentario TEXT
);

alter table alarma
    add constraint FK_alarma_guardia
    foreign key (guardia_idguardia)
    references guardia(idguardia)
    on update CASCADE
    on delete NO ACTION;

alter table alarma
    add constraint FK_alarma_vecino
    foreign key (vecino_idvecino)
    references vecino(idvecino)
    on update CASCADE
    on delete NO ACTION;

CREATE TABLE escolta(
    idescolta SERIAL PRIMARY KEY,
    vecino_idvecino VARCHAR,
    guardia_idguardia VARCHAR,
    fecha TIMESTAMP,
    estado VARCHAR,
    direccion VARCHAR,
    modalidad VARCHAR
);

alter table escolta
    add constraint FK_escolta_guardia
    foreign key (guardia_idguardia)
    references guardia(idguardia)
    on update CASCADE
    on delete NO ACTION;

alter table escolta
    add constraint FK_escolta_vecino
    foreign key (vecino_idvecino)
    references vecino(idvecino)
    on update CASCADE
    on delete NO ACTION;

CREATE TABLE hito(
    idhito SERIAL PRIMARY KEY,
    alarma_idalarma SERIAL,
    fecha TIMESTAMP,
    texto TEXT
);

alter table hito
    add constraint FK_hito_alarma
    foreign key (alarma_idalarma)
    references alarma(idalarma)
    on update CASCADE
    on delete NO ACTION;