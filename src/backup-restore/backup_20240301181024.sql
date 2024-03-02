--
-- PostgreSQL database cluster dump
--

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE postgres;
ALTER ROLE postgres WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:fNVfM1b6y5DJO12kBP3bvg==$Oh8lrneyxm3A65XjmrgAcSLg4ByBIQtTJyKTBQ5whqc=:XdBmRXTlEWZjRG8HMquhmdL36bKJw7IDAEcBHC90RB8=';






--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

-- Dumped from database version 14.3 (Debian 14.3-1.pgdg110+1)
-- Dumped by pg_dump version 14.3 (Debian 14.3-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- PostgreSQL database dump complete
--

--
-- Database "FixsellDB" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 14.3 (Debian 14.3-1.pgdg110+1)
-- Dumped by pg_dump version 14.3 (Debian 14.3-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: FixsellDB; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE "FixsellDB" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.utf8';


ALTER DATABASE "FixsellDB" OWNER TO postgres;

\connect "FixsellDB"

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: consumible_color_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.consumible_color_enum AS ENUM (
    'K',
    'Y',
    'M',
    'C'
);


ALTER TYPE public.consumible_color_enum OWNER TO postgres;

--
-- Name: consumible_origen_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.consumible_origen_enum AS ENUM (
    'OEM',
    'Generico',
    'Recarga'
);


ALTER TYPE public.consumible_origen_enum OWNER TO postgres;

--
-- Name: order_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.order_status_enum AS ENUM (
    'pending',
    'processing',
    'shipped',
    'delivered'
);


ALTER TYPE public.order_status_enum OWNER TO postgres;

--
-- Name: product_category_withdrawal_strategy_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.product_category_withdrawal_strategy_enum AS ENUM (
    'fifo',
    'lifo',
    'nearest',
    'least packages'
);


ALTER TYPE public.product_category_withdrawal_strategy_enum OWNER TO postgres;

--
-- Name: reception_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.reception_status_enum AS ENUM (
    'BORRADOR',
    'HECHO',
    'PREPARADO',
    'CANCELADO'
);


ALTER TYPE public.reception_status_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: brand; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.brand (
    id integer NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.brand OWNER TO postgres;

--
-- Name: brand_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.brand_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.brand_id_seq OWNER TO postgres;

--
-- Name: brand_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.brand_id_seq OWNED BY public.brand.id;


--
-- Name: category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.category (
    id integer NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.category OWNER TO postgres;

--
-- Name: category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.category_id_seq OWNER TO postgres;

--
-- Name: category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.category_id_seq OWNED BY public.category.id;


--
-- Name: consumible; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.consumible (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    price numeric NOT NULL,
    "longDescription" text,
    category character varying,
    brand character varying,
    sku character varying,
    color public.consumible_color_enum,
    yield integer,
    "compatibleModels" text[],
    currency character varying,
    img_url text[],
    volume numeric,
    origen public.consumible_origen_enum,
    "shortDescription" text,
    "counterpartId" uuid
);


ALTER TABLE public.consumible OWNER TO postgres;

--
-- Name: consumible_printers_printer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.consumible_printers_printer (
    "consumibleId" uuid NOT NULL,
    "printerId" uuid NOT NULL
);


ALTER TABLE public.consumible_printers_printer OWNER TO postgres;

--
-- Name: deal; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.deal (
    id integer NOT NULL,
    "dealEndDate" timestamp without time zone,
    "dealStartDate" timestamp without time zone,
    "dealPrice" numeric,
    "dealDiscountPercentage" numeric,
    "dealDescription" text,
    "dealCurrency" text,
    "printerId" uuid,
    "consumibleId" uuid
);


ALTER TABLE public.deal OWNER TO postgres;

--
-- Name: deal_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.deal_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.deal_id_seq OWNER TO postgres;

--
-- Name: deal_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.deal_id_seq OWNED BY public.deal.id;


--
-- Name: order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."order" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    amount numeric NOT NULL,
    "shippingName" character varying NOT NULL,
    "shippingAddress1" character varying NOT NULL,
    "shippingAddress2" character varying NOT NULL,
    city character varying NOT NULL,
    state character varying NOT NULL,
    zip character varying NOT NULL,
    country character varying NOT NULL,
    phone character varying NOT NULL,
    status public.order_status_enum DEFAULT 'pending'::public.order_status_enum NOT NULL,
    email character varying NOT NULL,
    date timestamp without time zone DEFAULT now() NOT NULL,
    shipped boolean DEFAULT false NOT NULL,
    "trackingNumber" character varying
);


ALTER TABLE public."order" OWNER TO postgres;

--
-- Name: order_detail; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_detail (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    price numeric NOT NULL,
    quantity integer NOT NULL,
    "orderId" uuid,
    "consumibleId" uuid
);


ALTER TABLE public.order_detail OWNER TO postgres;

--
-- Name: package; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.package (
    id integer NOT NULL,
    "packageDuration" integer,
    "packagePrice" numeric,
    "packageDiscountPercentage" numeric,
    "packageDescription" text,
    "packagePrints" integer,
    "packageExtraClickPrice" numeric,
    "packageEndDate" timestamp without time zone,
    "packageStartDate" timestamp without time zone,
    "packageDepositPrice" numeric,
    "packageIncludes" text[],
    "printerId" uuid,
    "packageCurrency" character varying
);


ALTER TABLE public.package OWNER TO postgres;

--
-- Name: package_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.package_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.package_id_seq OWNER TO postgres;

--
-- Name: package_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.package_id_seq OWNED BY public.package.id;


--
-- Name: printer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.printer (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    brand character varying NOT NULL,
    model character varying NOT NULL,
    datasheet_url character varying,
    img_url text[],
    description character varying,
    price double precision DEFAULT '100'::double precision,
    category character varying,
    color boolean,
    rentable boolean,
    sellable boolean,
    tags text[] DEFAULT '{}'::text[] NOT NULL,
    "powerConsumption" character varying,
    dimensions character varying,
    "maxPrintSizeSimple" character varying,
    "maxPrintSize" character varying,
    "printSize" character varying,
    "duplexUnit" boolean,
    "paperSizes" character varying,
    "applicableOS" character varying,
    "printerFunctions" character varying DEFAULT 'Impresión, copiado y escaneo'::character varying,
    barcode text[],
    "maxPaperWeight" integer,
    "printVelocity" integer,
    currency character varying DEFAULT 'usd'::character varying
);


ALTER TABLE public.printer OWNER TO postgres;

--
-- Name: printer_consumibles_consumible; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.printer_consumibles_consumible (
    "printerId" uuid NOT NULL,
    "consumibleId" uuid NOT NULL
);


ALTER TABLE public.printer_consumibles_consumible OWNER TO postgres;

--
-- Name: product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    buyable boolean NOT NULL,
    sellable boolean NOT NULL,
    product_image character varying,
    product_type character varying NOT NULL,
    product_price double precision NOT NULL,
    product_value character varying NOT NULL,
    product_intern_id character varying NOT NULL,
    product_barcode character varying,
    product_sticker character varying
);


ALTER TABLE public.product OWNER TO postgres;

--
-- Name: product_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_category (
    id integer NOT NULL,
    category_name character varying NOT NULL,
    withdrawal_strategy public.product_category_withdrawal_strategy_enum DEFAULT 'fifo'::public.product_category_withdrawal_strategy_enum NOT NULL,
    "parentCategoryId" integer
);


ALTER TABLE public.product_category OWNER TO postgres;

--
-- Name: product_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.product_category_id_seq OWNER TO postgres;

--
-- Name: product_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_category_id_seq OWNED BY public.product_category.id;


--
-- Name: product_operations_logistic; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_operations_logistic (
    id integer NOT NULL,
    routes text,
    product_responsable text NOT NULL,
    product_weight double precision NOT NULL,
    product_volume double precision NOT NULL,
    product_delivery_time integer NOT NULL,
    "productId" uuid
);


ALTER TABLE public.product_operations_logistic OWNER TO postgres;

--
-- Name: product_operations_logistic_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_operations_logistic_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.product_operations_logistic_id_seq OWNER TO postgres;

--
-- Name: product_operations_logistic_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_operations_logistic_id_seq OWNED BY public.product_operations_logistic.id;


--
-- Name: product_product_categories_product_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_product_categories_product_category (
    "productId" uuid NOT NULL,
    "productCategoryId" integer NOT NULL
);


ALTER TABLE public.product_product_categories_product_category OWNER TO postgres;

--
-- Name: reception; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reception (
    id integer NOT NULL,
    receive_from character varying NOT NULL,
    operation_type character varying NOT NULL,
    expected_date timestamp without time zone NOT NULL,
    document_origin character varying NOT NULL,
    responsible character varying NOT NULL,
    notes character varying NOT NULL,
    status public.reception_status_enum DEFAULT 'BORRADOR'::public.reception_status_enum NOT NULL
);


ALTER TABLE public.reception OWNER TO postgres;

--
-- Name: reception_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reception_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.reception_id_seq OWNER TO postgres;

--
-- Name: reception_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reception_id_seq OWNED BY public.reception.id;


--
-- Name: reception_products_product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reception_products_product (
    "receptionId" integer NOT NULL,
    "productId" uuid NOT NULL
);


ALTER TABLE public.reception_products_product OWNER TO postgres;

--
-- Name: role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.role OWNER TO postgres;

--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying NOT NULL,
    name character varying NOT NULL,
    password character varying NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Name: user_roles_role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_roles_role (
    "userId" uuid NOT NULL,
    "roleId" uuid NOT NULL
);


ALTER TABLE public.user_roles_role OWNER TO postgres;

--
-- Name: brand id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brand ALTER COLUMN id SET DEFAULT nextval('public.brand_id_seq'::regclass);


--
-- Name: category id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category ALTER COLUMN id SET DEFAULT nextval('public.category_id_seq'::regclass);


--
-- Name: deal id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.deal ALTER COLUMN id SET DEFAULT nextval('public.deal_id_seq'::regclass);


--
-- Name: package id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.package ALTER COLUMN id SET DEFAULT nextval('public.package_id_seq'::regclass);


--
-- Name: product_category id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_category ALTER COLUMN id SET DEFAULT nextval('public.product_category_id_seq'::regclass);


--
-- Name: product_operations_logistic id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_operations_logistic ALTER COLUMN id SET DEFAULT nextval('public.product_operations_logistic_id_seq'::regclass);


--
-- Name: reception id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reception ALTER COLUMN id SET DEFAULT nextval('public.reception_id_seq'::regclass);


--
-- Data for Name: brand; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.brand (id, name) FROM stdin;
17	Kyocera
18	Konica Minolta
19	Audley
20	Epson
21	Prixato
22	Hp
\.


--
-- Data for Name: category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.category (id, name) FROM stdin;
27	Oficina
28	Plotter
29	Produccion
30	Etiquetas
31	Artes Graficas
32	Inyeccion de Tinta
\.


--
-- Data for Name: consumible; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.consumible (id, name, price, "longDescription", category, brand, sku, color, yield, "compatibleModels", currency, img_url, volume, origen, "shortDescription", "counterpartId") FROM stdin;
6cd036da-6dc9-4dd2-b5e1-4af95f936409	TN014	150	El cartucho de tóner Konica TN014 proporciona un alto rendimiento y resultados eficientes. Con su excelente calidad de impresión, el tóner Konica TN014 ofrece una impresión de alta resolución y es adecuado para impresiones realizadas a gran velocidad. El cartucho de tóner negro original Konica Minolta TN014 ofrece imágenes suaves que le proporcionan un producto final impecable.	Toner	Konica Minolta	A3VV130	K	137000	{"Konica Minolta Bizhub Press 1052, 1250, 1250P"}	USD	{https://fixsell-website-images.s3.amazonaws.com/Consumibles/imagenes/Konica_Minolta/TN014/1709071947567-Premium-Toner-Cartridge-TN014-for-Konica-Minolta-Bizhub-PRESS-1052-1250-1.png,https://fixsell-website-images.s3.amazonaws.com/Consumibles/imagenes/Konica_Minolta/TN014/1709071948143-Premium-Toner-Cartridge-TN014-for-Konica-Minolta-Bizhub-PRESS-1052-1250-2(1).png,https://fixsell-website-images.s3.amazonaws.com/Consumibles/imagenes/Konica_Minolta/TN014/1709071948585-Premium-Toner-Cartridge-TN014-for-Konica-Minolta-Bizhub-PRESS-1052-1250-3.png,https://fixsell-website-images.s3.amazonaws.com/Consumibles/imagenes/Konica_Minolta/TN014/1709071949084-Premium-Toner-Cartridge-TN014-for-Konica-Minolta-Bizhub-PRESS-1052-1250-4.png}	2100	OEM	El cartucho de tóner Konica TN014 proporciona un alto rendimiento y resultados eficientes.	4dce37da-3f7c-4db3-bed4-40a6dcf113ea
75acffcb-c9b9-40a5-ada4-1449e3d03fcd	Consumible 2	100	This is a long description	Category 1	Brand 3	SKU1	K	1000	{"Model 1","Model 2"}	USD	\N	10	OEM	This is a short description	\N
f408a8c4-1759-41b1-b421-29f8fa0839c2	TN015	150	El cartucho de tóner Konica TN015 proporciona un alto rendimiento y resultados eficientes. Con su excelente calidad de impresión, el tóner Konica TN015 ofrece una impresión de alta resolución y es adecuado para impresiones realizadas a gran velocidad. El cartucho de tóner negro original Konica Minolta TN015 ofrece imágenes suaves que le proporcionan un producto final impecable.	Toner	Konica Minolta	A3VV131	K	137000	{"Konica Minolta Bizhub Pro 951"}	USD	{https://fixsell-website-images.s3.amazonaws.com/Consumibles/imagenes/Konica_Minolta/TN015/1709073304011-High-Page-Yield-Compatible-Toner-Cartridge-TN015-for-Minolta-Bizhub-Pro-951-2.png,https://fixsell-website-images.s3.amazonaws.com/Consumibles/imagenes/Konica_Minolta/TN015/1709073304412-High-Page-Yield-Compatible-Toner-Cartridge-TN015-for-Minolta-Bizhub-Pro-951-1.png,https://fixsell-website-images.s3.amazonaws.com/Consumibles/imagenes/Konica_Minolta/TN015/1709073304804-High-Page-Yield-Compatible-Toner-Cartridge-TN015-for-Minolta-Bizhub-Pro-951.png,https://fixsell-website-images.s3.amazonaws.com/Consumibles/imagenes/Konica_Minolta/TN015/1709073305321-High-Page-Yield-Compatible-Toner-Cartridge-TN015-for-Minolta-Bizhub-Pro-951-3.png,https://fixsell-website-images.s3.amazonaws.com/Consumibles/imagenes/Konica_Minolta/TN015/1709073305717-TN015-mp4.png}	2100	OEM	El cartucho de tóner Konica TN015 proporciona un alto rendimiento y resultados eficientes.	7e63bf61-12e9-47ae-afd4-ab6bc2fbb9a5
14c4aed3-c45c-4c57-83d0-cb76d6af8f8a	Consumible 1	100	This is a long description	Category 1	Brand 1	SKU1	K	1000	{"Model 1","Model 2"}	USD	\N	10	OEM	This is a short description	\N
4dce37da-3f7c-4db3-bed4-40a6dcf113ea	TN016	149.98	El cartucho de tóner Konica TN016 proporciona un alto rendimiento y resultados eficientes. Con su excelente calidad de impresión, el tóner Konica TN016 ofrece una impresión de alta resolución y es adecuado para impresiones realizadas a gran velocidad. El cartucho de tóner negro original Konica Minolta TN016 ofrece imágenes suaves que le proporcionan un producto final impecable.	Toner	Konica Minolta	A88J130	K	82000	{"Konica Minolta Bizhub Pro 1100"}	USD	{https://fixsell-website-images.s3.amazonaws.com/Consumibles/imagenes/Konica_Minolta/TN016/1709073532262-High-Quality-Compatible-Toner-Cartridge-TN016-for-Minolta-Bizhub-Pro-1100.png,https://fixsell-website-images.s3.amazonaws.com/Consumibles/imagenes/Konica_Minolta/TN016/1709073532683-High-Quality-Compatible-Toner-Cartridge-TN016-for-Minolta-Bizhub-Pro-1100-1.png,https://fixsell-website-images.s3.amazonaws.com/Consumibles/imagenes/Konica_Minolta/TN016/1709073533653-High-Quality-Compatible-Toner-Cartridge-TN016-for-Minolta-Bizhub-Pro-1100-2.png,https://fixsell-website-images.s3.amazonaws.com/Consumibles/imagenes/Konica_Minolta/TN016/1709073534092-High-Quality-Compatible-Toner-Cartridge-TN016-for-Minolta-Bizhub-Pro-1100-3.png}	1645	OEM	El cartucho de tóner Konica TN016 proporciona un alto rendimiento y resultados eficientes.	6cd036da-6dc9-4dd2-b5e1-4af95f936409
e47feb2f-a357-4d7e-9a85-ccb605e156cb	TN011	150	El cartucho de tóner Konica TN011 proporciona un alto rendimiento y resultados eficientes. Con su excelente calidad de impresión, el tóner Konica TN011 ofrece una impresión de alta resolución y es adecuado para impresiones realizadas a gran velocidad. El cartucho de tóner negro original Konica Minolta TN011 ofrece imágenes suaves que le proporcionan un producto final impecable.	Toner	Konica Minolta	A0TH030	K	119000	{"Konica Minolta bizhub Pro 1200","Konica Minolta bizhub Pro 1051","Konica Minolta bizhub Pro 1200P"}	USD	{https://fixsell-website-images.s3.amazonaws.com/Consumibles/imagenes/Konica_Minolta/TN011/1709071039802-tn011-removebg-preview.png,https://fixsell-website-images.s3.amazonaws.com/Consumibles/imagenes/Konica_Minolta/TN011/1709071040445-Konica-Minolta-Color-Copier-Toner-Cartridge-TN011-TN015-TN017-For-Bizhub-Pro-1051-1200-1200P-951-AccurioPress-6120-3.png,https://fixsell-website-images.s3.amazonaws.com/Consumibles/imagenes/Konica_Minolta/TN011/1709071041007-Konica-Minolta-Color-Copier-Toner-Cartridge-TN011-TN015-TN017-For-Bizhub-Pro-1051-1200-1200P-951-AccurioPress-6120-2.png,https://fixsell-website-images.s3.amazonaws.com/Consumibles/imagenes/Konica_Minolta/TN011/1709071041518-Konica-Minolta-Color-Copier-Toner-Cartridge-TN011-TN015-TN017-For-Bizhub-Pro-1051-1200-1200P-951-AccurioPress-6120-1.png,https://fixsell-website-images.s3.amazonaws.com/Consumibles/imagenes/Konica_Minolta/TN011/1709071042377-toner_konica_minolta_bizhub_pro_1051_1200_1200p_tn_011_preto_2571_1_d53d9afc878aee5f8d244425ff8e7910-removebg-preview.png}	2100	OEM	El cartucho de tóner Konica TN011 proporciona un alto rendimiento y resultados eficientes.	672de26e-924b-40e6-9521-9867af3e0d9d
672de26e-924b-40e6-9521-9867af3e0d9d	Consumible 2	100	This is a long description	Category 1	Brand 1	SKU1	K	1000	{"Model 1","Model 2"}	USD	\N	10	OEM	This is a short description	7e63bf61-12e9-47ae-afd4-ab6bc2fbb9a5
7e63bf61-12e9-47ae-afd4-ab6bc2fbb9a5	asd	0.03	asd	Toner	asd	asdf	K	2	{"Bizhub Press 2250"}	USD	{}	4	OEM	asd	\N
ce2e6053-b01b-41da-9925-c0134319b882	asdasd	0.02		Toner	asdasd	asdasd	K	5	{""}	USD	{}	0	OEM		\N
\.


--
-- Data for Name: consumible_printers_printer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.consumible_printers_printer ("consumibleId", "printerId") FROM stdin;
\.


--
-- Data for Name: deal; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.deal (id, "dealEndDate", "dealStartDate", "dealPrice", "dealDiscountPercentage", "dealDescription", "dealCurrency", "printerId", "consumibleId") FROM stdin;
1	2024-12-31 17:59:59.999	2022-12-31 18:00:00	25000	20	Hello	\N	\N	\N
3	2024-02-26 18:00:00	2024-02-25 18:00:00	80	20	asdf	\N	\N	\N
4	2024-02-27 18:00:00	2024-02-25 18:00:00	80	20	asdfasdwerf	USD	\N	\N
5	2022-12-30 18:00:00	2021-12-31 18:00:00	100	10	This is a deal for a printer	USD	\N	\N
6	2022-12-30 18:00:00	2021-12-31 18:00:00	50	20	This is a deal for a consumible	USD	\N	\N
7	2022-12-30 18:00:00	2021-12-31 18:00:00	50	20	This is a deal for a consumible	USD	\N	\N
9	2023-12-30 18:00:00	2022-12-31 18:00:00	40	20	This is a deal for a consumible	USD	431754ed-6851-4537-bc2a-43f831bc4344	\N
10	2023-12-30 18:00:00	2022-12-31 18:00:00	40	20	This is a deal for a consumible	USD	\N	14c4aed3-c45c-4c57-83d0-cb76d6af8f8a
11	2023-12-30 18:00:00	2022-12-31 18:00:00	40	20	This is a deal for a consumible	USD	\N	14c4aed3-c45c-4c57-83d0-cb76d6af8f8a
12	2023-12-30 18:00:00	2022-12-31 18:00:00	40	20	This is a deal for a consumible	USD	\N	6cd036da-6dc9-4dd2-b5e1-4af95f936409
13	2023-12-30 18:00:00	2022-12-31 18:00:00	40	20	This is a deal for a consumible	USD	\N	4dce37da-3f7c-4db3-bed4-40a6dcf113ea
\.


--
-- Data for Name: order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."order" (id, amount, "shippingName", "shippingAddress1", "shippingAddress2", city, state, zip, country, phone, status, email, date, shipped, "trackingNumber") FROM stdin;
\.


--
-- Data for Name: order_detail; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_detail (id, name, price, quantity, "orderId", "consumibleId") FROM stdin;
\.


--
-- Data for Name: package; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.package (id, "packageDuration", "packagePrice", "packageDiscountPercentage", "packageDescription", "packagePrints", "packageExtraClickPrice", "packageEndDate", "packageStartDate", "packageDepositPrice", "packageIncludes", "printerId", "packageCurrency") FROM stdin;
25	12	80	20	Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tempor id eu nisl nunc mi ipsum faucibus vitae. 	4	0.03	2024-03-01 18:00:00	2024-02-23 18:00:00	\N	{"asdf asdf ","asdf g 1000","hello asdf da d ","test asdf ","test lorem i[psum"}	431754ed-6851-4537-bc2a-43f831bc4344	USD
\.


--
-- Data for Name: printer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.printer (id, brand, model, datasheet_url, img_url, description, price, category, color, rentable, sellable, tags, "powerConsumption", dimensions, "maxPrintSizeSimple", "maxPrintSize", "printSize", "duplexUnit", "paperSizes", "applicableOS", "printerFunctions", barcode, "maxPaperWeight", "printVelocity", currency) FROM stdin;
95efa4d1-3b11-4ad6-82a9-3b7c0acfeded	Kyocera	ECOSYS M6235cidn	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Kyocera/ECOSYS_M6235cidn/ECOSYS_M6235cidn_datasheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Kyocera/ECOSYS_M6235cidn/ECOSYS-M6235cidn-front.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Kyocera/ECOSYS_M6235cidn/ECOSYS-M6235cidn-left.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Kyocera/ECOSYS_M6235cidn/ECOSYS-M6235cidn-right.png}	Este modelo de la familia ECOSYS en A4 está especialmente diseñado para medianos y grandes grupos de trabajo. Ofreciendo una rentabilidad y rapidez en la impresión de 35 páginas por minuto	100.15	Oficina	t	f	t	{}	110-120 V; 532 W	47.5 x 55.8 x 61.6 cm	Legal	8.5" x 14"	Carta	t	Legal, Carta, A6-A4, B5, B6, Tamaños Personalizados	Todos los sistemas operativos de Windows, MAC OS versiones 10.8 o superior, UNIX, LINUX, así como otros sistemas operativos bajo petición	Impresión, copiado y escaneo	\N	220	35	USD
948df99c-9602-4775-9378-899485ad537a	Konica Minolta	AccurioPrint C4065	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Konica_Minolta/AccurioPrint_C4065/AccurioPrint_C4065_Spec_Sheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/AccurioPrint_C4065/AccurioPrint-C4065-Full.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/AccurioPrint_C4065/C4080_Front1.png}	La prensa digital AccurioPrint C4065 ofrece productividad y versatilidad en una unidad compacta y asequible. Es la prensa digital perfecta para talleres de impresión de bajo volumen, departamentos de reprografía corporativos y entornos de oficina que no requieren amplias opciones de acabado y de color que se combinan con AccurioPress C4080. La excelente calidad de imagen y color, la versatilidad de los medios y alta velocidad de salida de 65 ppm en color o 80 ppm en blanco y negro hacen de esta prensa una solución de alto valor pero rentable para los profesionales de la impresión. Disponible con acabado de folletos y grapas, esta prensa digital flexible puede imprimir hojas de impresión a dos caras de hasta 34” de largo y sobres con facilidad y sin la necesidad de un fusor adicional. AccurioPrint C4065 proporciona todo lo que su empresa necesita para triunfar.	32500	Artes Graficas	t	f	t	{}	208-240 V	79.98 x 90.2 x 107.5 cm	Banner	13" x 51.18"	Tabloide Plus	t	A6-SRA3	Windows 8.1/10; Windows Server 2012/R2/2016/2019; Mac OS X 10.11-14	Impresión, copiado y escaneo	\N	350	65	USD
938cfccd-19b7-46e4-8344-41fae9f7dd25	Konica Minolta	AccurioPress C4080	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Konica_Minolta/AccurioPress_C4080/AccurioPress_C4080-C4070_Spec_Sheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/AccurioPress_C4080/AccurioPress-C4080-Front.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/AccurioPress_C4080/AccurioPress-C4080-Full.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/AccurioPress_C4080/AccurioPress-C4080-Side.png}	La Konica Minolta AccurioPrint C4080 es una impresora multifunción color de alto rendimiento diseñada para medianas y grandes empresas. Con sus rápidas velocidades de impresión, su avanzada gestión del color y sus capacidades de manejo de soportes, la AccurioPrint C4080 puede producir impresiones de alta calidad con una precisión y consistencia excepcionales. Equipada con tecnologías innovadoras como el tóner Simitri HD y un sistema de doble sensor, esta impresora ofrece imágenes y texto de alta calidad con un detalle asombroso, lo que la hace ideal para imprimir materiales de marketing, folletos, flyers y otros documentos profesionales. Sus avanzadas funciones de automatización, como la calibración automática del color y el ajuste del registro, ayudan a reducir los residuos y a aumentar la productividad, mientras que su interfaz de usuario personalizable y su integración con el software de gestión de flujos de trabajo facilitan su funcionamiento y su integración en los flujos de trabajo existentes. Con su diseño modular, manejo flexible del papel y opciones avanzadas de acabado, la AccurioPrint C4080 es una excelente opción para las empresas que buscan mejorar sus capacidades de impresión y obtener resultados de alta calidad.	100.15	Artes Graficas	t	f	t	{}	220-240 V	80 x 90.3 x 107.6 cm	Banner	13" x 51.18"	Tabloide Plus	t	A6-SRA3	Windows 8.1/10; Windows Server 2012/R2/2016/2019; Mac OS X 10.11-14	Impresión, copiado y escaneo	\N	400	85	USD
33d1cd8c-22b3-4b97-b2d0-902e214b465b	Konica Minolta	AccurioPress C12000	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Konica_Minolta/AcurrioPress_C12000/AccurioPress_C14000-C12000_Spec_Sheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/AccurioPress_C12000/AccurioPress-C12000-Front1.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/AccurioPress_C12000/AccurioPress-C12000-Side.png}	La Konica Minolta AccurioPress C12000 es una impresora de producción de alto volumen diseñada para entornos de impresión comercial. Con sus rápidas velocidades de impresión de hasta 120 páginas por minuto, su avanzada gestión del color y sus capacidades de manejo de soportes, la AccurioPress C12000 puede producir impresiones de alta calidad con una precisión y consistencia excepcionales. Equipada con tecnologías innovadoras como el tóner Simitri V, el optimizador de calidad inteligente IQ-501 y una resolución de 2400 x 2400 ppp, esta impresora de producción ofrece una calidad de imagen excepcional y un texto nítido, por lo que resulta ideal para imprimir materiales de marketing, libros, manuales y otros documentos profesionales. Sus avanzadas funciones de automatización, como el acabado en línea y la calibración automática del color, ayudan a reducir los residuos y a aumentar la productividad, mientras que su interfaz de usuario personalizable y su integración con el software de gestión de flujos de trabajo facilitan su manejo y su integración en los flujos de trabajo existentes. Con su rendimiento superior, fiabilidad y flexibilidad, la AccurioPress C12000 es una excelente opción para las empresas que buscan ampliar sus capacidades de impresión y obtener resultados de alta calidad.	100.15	Artes Graficas	t	f	t	{}	208-240 V	115.1 x 93.2 x 162 cm	Banner	13" x 51.18"	Tabloide Plus	t	A6-SRA3	Windows 8.1/10; Windows Server 2012/R2/2016/2019; Mac OS X 10.11-14	Impresión, copiado y escaneo	\N	450	120	USD
02511c98-a47a-487e-a97a-a6ac613b52b0	Konica Minolta	AccurioPress C14000	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Konica_Minolta/AccurioPress_C14000/AccurioPress_C14000-C12000_Spec_Sheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/AccurioPress_C14000/AccurioPress-C14000-Front1.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/AccurioPress_C14000/AccurioPress-C14000-Side.png}	La Konica Minolta AccurioPress C14000 es una impresora de producción de alto volumen diseñada para entornos de impresión comercial. Con sus velocidades de impresión ultrarrápidas de hasta 140 páginas por minuto, su gestión avanzada del color y sus capacidades de manejo de soportes, la AccurioPress C14000 puede producir impresiones de alta calidad con una precisión y consistencia excepcionales. Equipada con tecnologías innovadoras como el tóner Simitri V, el optimizador de calidad inteligente IQ-501 y una resolución de 2400 x 2400 ppp, esta impresora de producción ofrece una calidad de imagen excepcional y un texto nítido, por lo que resulta ideal para imprimir materiales de marketing, libros, manuales y otros documentos profesionales. Sus avanzadas funciones de automatización, como el acabado en línea y la calibración automática del color, ayudan a reducir los residuos y a aumentar la productividad, mientras que su interfaz de usuario personalizable y su integración con el software de gestión de flujos de trabajo facilitan su manejo y su integración en los flujos de trabajo existentes. Con su rendimiento superior, fiabilidad y flexibilidad, la AccurioPress C14000 es una excelente opción para las empresas que buscan ampliar sus capacidades de impresión y obtener resultados de alta calidad a una velocidad inigualable.	100.15	Artes Graficas	t	f	t	{}	208-240 V	115.1 x 93.2 x 162 cm	Banner	13" x 51.18"	Tabloide Plus	t	A6-SRA3	Windows 8.1/10; Windows Server 2012/R2/2016/2019; Mac OS X 10.11-14	Impresión, copiado y escaneo	\N	450	140	USD
ccfff377-f125-412c-84e4-8b5993b26f63	Konica Minolta	Bizhub Press C1060	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Konica_Minolta/Bizhub_Press_C1060/C1060L_Spec_Sheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_Press_C1060/bizhub-press-c1060-front.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_Press_C1060/bizhub-press-c1060-full.png}	La Konica Minolta Bizhub Press C1060 es una impresora de producción diseñada para entornos de impresión profesionales que requieren impresiones de alta calidad a un gran volumen. Con una velocidad de impresión de hasta 60 páginas por minuto, la Bizhub Press C1060 puede producir impresiones de alta calidad con una precisión y consistencia excepcionales. Sus avanzadas capacidades de manejo de papel, que incluyen una bandeja de papel de gran capacidad y una amplia gama de opciones de acabado, facilitan la impresión eficiente de trabajos de impresión complejos y diversos. La impresora también ofrece un funcionamiento sencillo con una gran pantalla táctil en color y una interfaz personalizable, lo que permite una fácil integración en los flujos de trabajo existentes. La Bizhub Press C1060 es ideal para imprimir una gran variedad de documentos como folletos, manuales y flyers en grandes volúmenes, por lo que es adecuada para empresas que requieren capacidades de impresión rápidas y eficientes. Con su rendimiento y fiabilidad superior, la Konica Minolta Bizhub Press C1060 es una excelente opción para las empresas que buscan mejorar sus capacidades de impresión y agilizar sus procesos de impresión.	100.15	Artes Graficas	t	t	f	{}	208-240 V; 22A; 	75.9 x 99.3 x 107.4 cm	Tabloide Plus	13" x 19"	Tabloide Plus	t	A6-SRA3	Windows: Windows 7, Windows 8, Windows 8.1, Windows 10, Windows Server 2008, Windows Server 2008 R2, Windows Server 2012, Windows Server 2012 R2, Windows Server 2016, Windows Server 2019; Macintosh: Mac OS X 10.8 or later; Linux: RedHat Enterprise Linux 6.5/6.6/7.0, SUSE Linux Enterprise Desktop 11 SP3, SUSE Linux Enterprise Desktop 12	Impresión, copiado y escaneo	\N	350	60	USD
047588c5-7f44-4d4e-9820-4d4c66545586	Konica Minolta	Bizhub Press C2060	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Konica_Minolta/AccurioPress_C2060/AccurioPress_C2060_Spec_Sheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_Press_C2060/bizhub-press-c2060-front.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_Press_C2060/bizhub-press-c2060-front-2.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_Press_C2060/bizhub-press-c2060-full.png}	La Konica Minolta Bizhub Press C2060 es una impresora de producción de alto rendimiento diseñada para entornos de impresión profesionales que requieren impresiones de alta calidad a un gran volumen. Con una velocidad de impresión de hasta 60 páginas por minuto, la Bizhub Press C2060 puede producir impresiones de alta calidad con una precisión y consistencia excepcionales. Sus avanzadas capacidades de manejo de papel, incluyendo una bandeja de papel de gran capacidad y una amplia gama de opciones de acabado, facilitan la impresión eficiente de trabajos de impresión complejos y diversos. La impresora también ofrece un funcionamiento sencillo con una gran pantalla táctil en color y una interfaz personalizable, lo que permite una fácil integración en los flujos de trabajo existentes. La Bizhub Press C2060 es ideal para imprimir una gran variedad de documentos como folletos, manuales y flyers en grandes volúmenes, por lo que es adecuada para empresas que requieren capacidades de impresión rápidas y eficientes. Con su rendimiento y fiabilidad superiores, la Konica Minolta Bizhub Press C2060 es una excelente opción para las empresas que buscan mejorar sus capacidades de impresión y agilizar sus procesos de impresión.	100.15	Artes Graficas	t	t	f	{}	208-240 V; 21A; 	75.9 x 99.3 x 107.4 cm	Tabloide Plus	13" x 19"	Tabloide Plus	t	A6-SRA3	Windows: Windows 7, Windows 8, Windows 8.1, Windows 10, Windows Server 2008, Windows Server 2008 R2, Windows Server 2012, Windows Server 2012 R2, Windows Server 2016, Windows Server 2019; Macintosh: Mac OS X 10.8 or later; Linux: RedHat Enterprise Linux 6.5/6.6/7.0, SUSE Linux Enterprise Desktop 11 SP3, SUSE Linux Enterprise Desktop 12	Impresión, copiado y escaneo	\N	350	60	USD
212b6c9b-a485-48fb-80c0-f0e6821f4a83	Konica Minolta	Accurio Label 230	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Konica_Minolta/Accurio_Label_230/AccurioLabel_230_SpecSheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Accurio_Label_230/accuriolabel-230-front1.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Accurio_Label_230/accuriolabel-230-side.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Accurio_Label_230/accuriolabel-230-top1.png}	La Konica Minolta AccurioLabel 230 es una impresora digital de etiquetas diseñada para una impresión de etiquetas rentable y de alta calidad. Ofrece una calidad de impresión superior con una resolución máxima de 1200 x 1200 DPI, y puede imprimir a velocidades de hasta 23,4 metros por minuto, lo que la hace ideal para tiradas pequeñas y medianas de impresión de etiquetas. La AccurioLabel 230 está equipada con funciones avanzadas como el control automático de la tensión de la banda, el guiado de la banda y el registro preciso del color, lo que garantiza unos resultados de impresión precisos y uniformes. La impresora también es compatible con una amplia gama de soportes, como papel, película, sustratos metálicos y texturizados. La AccurioLabel 230 es fácil de usar y se puede integrar fácilmente en los flujos de trabajo existentes, con el sistema de acabado opcional que permite la producción de etiquetas en una gama de tamaños y formas. Su diseño compacto facilita la instalación y requiere un espacio mínimo. En general, la Konica Minolta AccurioLabel 230 es una impresora de etiquetas versátil y fiable que ofrece a las empresas una solución de impresión de etiquetas rentable y de alta calidad.	100.15	Etiquetas	t	f	t	{}	208-240 V	386.9 x 114.1 x 147.8 cm	13"	13"	Rollo 13	f	Rollo (4" - 13")	Windows 7/8.1/10 pro (64bit)	Impresión	\N	256	390	USD
a7b6f765-5ec9-47ec-a76d-4a8014114a97	Konica Minolta	Bizhub 4020i	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Konica_Minolta/Bizhub_4020i/bizhub_4020i_Spec_Sheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_4020i/bizhub-4020i-front.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_4020i/bizhub-4020i-left1.png}	La Konica Minolta Bizhub 4020i es una impresora multifunción diseñada para pequeñas y medianas empresas que requieren capacidades de impresión y escaneado de alta calidad. Con una velocidad de impresión de hasta 42 páginas por minuto, la Bizhub 4020i puede producir impresiones de alta calidad con una precisión y consistencia excepcionales. Sus avanzadas capacidades de escaneado, incluida la posibilidad de escanear a correo electrónico o servidores FTP, facilitan la digitalización y el uso compartido de documentos importantes de forma eficiente. La impresora también cuenta con una interfaz fácil de usar con una gran pantalla táctil en color, lo que permite una fácil integración en los flujos de trabajo existentes. La Bizhub 4020i es ideal para imprimir una gran variedad de documentos como informes, facturas y presentaciones, por lo que es adecuada para empresas que requieren una solución de impresión fiable y eficiente. Con su diseño compacto y fácil instalación, la Konica Minolta Bizhub 4020i es una excelente opción para pequeñas y medianas empresas que buscan mejorar sus capacidades de impresión y escaneado.	100.15	Oficina	f	f	t	{}	110-120 V; menos de 1.3 kW	 43.5 x 42.7 x 48.6 cm (sin opciones)	Carta	8.25" x 11.75"	Carta	t	Carta, A6-A4	Windows 7 (32/64); Windows 8.1 (32/64); Windows 10 (32/64); Windows Server 2008 (32/64); Windows Server 2008 R2; Windows Server 2012; Windows Server 2012 R2; Windows Server 2016; Windows Server 2019; Macintosh OS X 10.10 or later; Linux	Impresión, copiado y escaneo	\N	200	40	USD
d0e96d30-b74f-4670-be54-5df41cb75260	Konica Minolta	Bizhub 5020i	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Konica_Minolta/Bizhub_5020i/bizhub-5020i-DATASHEET-PRINT.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_5020i/bizhub-5020i-front.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_5020i/bizhub-5020i-left1.png}	La Konica Minolta Bizhub 5020i es una potente impresora multifunción diseñada para pequeñas y medianas empresas que requieren capacidades de impresión, copia y escaneado de alta velocidad y calidad. Con una velocidad de impresión de hasta 52 páginas por minuto, la Bizhub 5020i puede producir impresiones de alta calidad con una precisión y consistencia excepcionales. Sus avanzadas funciones de escaneado, incluida la posibilidad de escanear a correo electrónico o servidores FTP, facilitan la digitalización y el uso compartido de documentos importantes de forma eficiente. La impresora también cuenta con una interfaz fácil de usar con una gran pantalla táctil en color, lo que permite una fácil integración en los flujos de trabajo existentes. La Bizhub 5020i es ideal para imprimir una gran variedad de documentos como informes, facturas y presentaciones, por lo que es adecuada para empresas que requieren una solución de impresión fiable y eficiente. Con su diseño compacto y fácil instalación, la Konica Minolta Bizhub 5020i es una excelente opción para pequeñas y medianas empresas que buscan mejorar sus capacidades de impresión y escaneado.	100.15	Oficina	f	f	t	{}	220-240 V; menos de 805 W	49.5 x 42.7 x 51.8 cm (sin opciones)	Legal	8.5" x 14"	Carta	t	Legal, Carta, A6-A4	Windows 7 (32/64); Windows 8/8.1 (32/64); Windows 10 (32/64); Windows Server 2008 (32/64); Windows Server 2008 R2; Windows Server 2012; Windows Server 2012 R2; Windows Server 2016; Windows Server 2019; Macintosh OS X 10.10 o posterior; Unix; Linux; Citrix; AirPrint (iOS); Mopria (Android);\nKonica Minolta Mobile Print (iOS/Android/Windows 10 Mobile);\nMobile Authentication and Pairing (iOS/Android)\nOpcional: Google Cloud Print; WiFi Direct	Impresión, copiado y escaneo	\N	200	52	USD
c3d90338-5aff-4eeb-9da5-ad79f5a7a354	Konica Minolta	Bizhub C4050i	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Konica_Minolta/Bizhub_C4050i/bizhub-C4050i-Datasheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_C4050i/bizhub-C4050i-full.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_C4050i/bizhub-C4050i-left1.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_C4050i/bizhub-C4050i-right1.png}	La Konica Minolta Bizhub C4050i es una impresora multifunción versátil diseñada para pequeñas y medianas empresas que requieren capacidades de impresión, escaneado y copia de alta velocidad y calidad. Con una velocidad de impresión de hasta 42 páginas por minuto, la Bizhub C4050i puede producir impresiones de alta calidad con una precisión y consistencia excepcionales. Sus avanzadas funciones de escaneado, incluida la posibilidad de escanear a correo electrónico o servidores FTP, facilitan la digitalización y el uso compartido de documentos importantes de forma eficiente. La impresora también cuenta con una interfaz fácil de usar con una gran pantalla táctil en color, lo que permite una fácil integración en los flujos de trabajo existentes. La Bizhub C4050i es ideal para imprimir una gran variedad de documentos como informes, folletos y presentaciones, por lo que es adecuada para empresas que requieren una solución de impresión fiable y eficiente. Con su diseño compacto y fácil instalación, la Konica Minolta Bizhub C4050i es una excelente opción para pequeñas y medianas empresas que buscan mejorar sus capacidades de impresión y escaneado.	100.15	Oficina	t	f	t	{}	220-240 V; menos de 1.45 kW	42 x 52.8 x 57.2 cm (sin opciones)	Legal	8.5" x 14"	Carta	t	Legal, Carta, A6-A4	Windows 7 (32/64); Windows 8/8.1 (32/64); Windows 10 (32/64); Windows Server 2008 (32/64); Windows Server 2008 R2; Windows Server 2012; Windows Server 2012 R2; Windows Server 2016; Windows Server 2019; Macintosh OS X 10.10 o posterior; Unix; Linux; Citrix; AirPrint (iOS); Mopria (Android);\nKonica Minolta Mobile Print (iOS/Android/Windows 10 Mobile);\nMobile Authentication and Pairing (iOS/Android)\nOpcional: Google Cloud Print; WiFi Direct	Impresión, copiado y escaneo	\N	210	42	USD
58d3bdb2-1cfa-498c-8461-845b94d9b20b	Konica Minolta	Bizhub 4000i	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Konica_Minolta/Bizhub_4000i/bizhub_4000i_Spec_Sheets.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_4000i/bizhub-4000i-front.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_4000i/bizhub-4000i-left1.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_4000i/bizhub-4000i-top1.png}	La Konica Minolta Bizhub 4000i es una impresora multifunción compacta y fiable diseñada para pequeñas y medianas empresas. Ofrece capacidades de impresión, escaneado y copia de alta calidad, con una velocidad de impresión de hasta 42 páginas por minuto. La impresora también cuenta con una serie de funciones avanzadas, como impresión automática a doble cara, compatibilidad con impresión móvil y opciones de impresión segura, lo que la convierte en la opción ideal para las empresas que necesitan una solución de impresión fiable y eficiente. Con un diseño compacto y una interfaz fácil de usar, la Bizhub 4000i es fácil de integrar en los flujos de trabajo existentes, mientras que su construcción duradera asegura que puede soportar un uso intensivo en un entorno de oficina ocupado. La impresora también es energéticamente eficiente, con un modo Eco que ayuda a reducir el consumo de energía y minimizar el impacto medioambiental. Con su sólido rendimiento, fácil instalación y bajos costes de funcionamiento, la Konica Minolta Bizhub 4000i es una excelente opción para pequeñas y medianas empresas que buscan mejorar sus capacidades de impresión.	100.15	Oficina	f	f	t	{}	110-120 V; menos de 620 W	37.3 x 38.8 x 28.7 cm (sin opciones)	Legal	8.5" x 14"	Carta	t	Legal, Carta, A6-A4	Windows 7 (32/64); Windows 8/8.1 (32/64); Windows 10 (32/64); Windows Server 2008 (32/64); Windows Server 2008 R2; Windows Server 2012; Windows Server 2012 R2; Windows Server 2016; Windows Server 2019; Macintosh OS X 10.10 o posterior; Unix; Linux; Citrix; AirPrint (iOS); Mopria (Android);\nKonica Minolta Mobile Print (iOS/Android/Windows 10 Mobile);\nMobile Authentication and Pairing (iOS/Android)\nOpcional: Google Cloud Print; WiFi Direct	Impresión, copiado y escaneo	\N	200	42	USD
b1521edd-942a-4b1e-b3f9-011da5c17534	Konica Minolta	Bizhub 5000i	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Konica_Minolta/Bizhub_5000i/bizhub_5000i_Data_Sheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_5000i/bizhub-5000i-front1.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_5000i/bizhub-5000i-full1.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_5000i/bizhub-5000i-left1.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_5000i/bizhub-5000i-top.png}	La Konica Minolta Bizhub 5000i es una impresora multifunción fiable y de alta velocidad diseñada para entornos de trabajo con gran actividad. Ofrece funciones de impresión, escaneado y copia de alta calidad, con una velocidad de impresión de hasta 50 páginas por minuto. La impresora también cuenta con opciones de seguridad avanzadas como autenticación de usuario, impresión segura y cifrado del disco duro para proteger la información confidencial. La Bizhub 5000i está equipada con una serie de funciones que mejoran la productividad, como la impresión automática a doble cara, la compatibilidad con impresión móvil y varias opciones de acabado, lo que la convierte en la opción ideal para las empresas que necesitan una solución de impresión rápida y eficiente. El diseño compacto de la impresora y su interfaz fácil de usar facilitan su integración en los flujos de trabajo existentes, mientras que su construcción duradera garantiza que pueda soportar un uso intensivo en un entorno de oficina ajetreado. Con su rendimiento fiable, funciones de seguridad avanzadas y bajos costes de funcionamiento, la Konica Minolta Bizhub 5000i es una excelente opción para empresas medianas y grandes que buscan optimizar sus capacidades de impresión.	100.15	Oficina	f	f	t	{}	220-240 V; menos de 770 W	40 x 39.6 x 28.8 cm (sin opciones)	Legal	8.5" x 14"	Carta	t	Legal, Carta, A6-A4	Windows 7 (32/64); Windows 8/8.1 (32/64); Windows 10 (32/64); Windows Server 2008 (32/64); Windows Server 2008 R2; Windows Server 2012; Windows Server 2012 R2; Windows Server 2016; Windows Server 2019; Macintosh OS X 10.10 o posterior; Unix; Linux; Citrix; AirPrint (iOS); Mopria (Android);\nKonica Minolta Mobile Print (iOS/Android/Windows 10 Mobile);\nMobile Authentication and Pairing (iOS/Android)\nOpcional: Google Cloud Print; WiFi Direct	Impresión, copiado y escaneo	\N	200	52	USD
545c7df8-9a1b-43c0-adc2-9018ba0a739e	Konica Minolta	Bizhub C300i	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Konica_Minolta/Bizhub_C300i/Konica-Minolta-Bizhub-C300i-spec-sheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_C300i/bizhub-C300i-front.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_C300i/bizhub-C300i-left.png}	La Konica Minolta Bizhub C300i es una versátil impresora multifunción en color diseñada para pequeñas y medianas empresas. Con una velocidad de impresión de hasta 30 páginas por minuto en color y blanco y negro, ofrece impresiones de alta calidad de forma rápida y eficiente. La interfaz de usuario y las funciones avanzadas de la impresora facilitan su uso, con controles intuitivos de pantalla táctil y una amplia gama de opciones de conectividad, incluida la compatibilidad con impresión móvil. La Bizhub C300i también incluye funciones de seguridad avanzadas como autenticación de usuario, impresión segura y cifrado del disco duro para proteger los datos confidenciales. Además, la impresora cuenta con impresión automática a doble cara y varias opciones de acabado, como grapado y perforado, para mejorar la productividad y agilizar los flujos de trabajo. Con su diseño compacto, funciones avanzadas y rendimiento fiable, la Konica Minolta Bizhub C300i es una excelente opción para pequeñas y medianas empresas que buscan una impresora multifunción que pueda manejar una variedad de tareas de manera eficiente y eficaz.	100.15	Oficina	t	f	t	{}	220-240 V; menos de 1.58 kW	61.5 x 68.8 x 77.9 cm (sin opciones)	Banner	11.69" x 47.2" 	Doble Carta	t	Legal, Carta, A6-A4	Windows 7 (32/64); Windows 8/8.1 (32/64); Windows 10 (32/64); Windows Server 2008 (32/64); Windows Server 2008 R2; Windows Server 2012; Windows Server 2012 R2; Windows Server 2016; Windows Server 2019; Macintosh OS X 10.10 o posterior; Unix; Linux; Citrix; AirPrint (iOS); Mopria (Android);\nKonica Minolta Mobile Print (iOS/Android/Windows 10 Mobile);\nMobile Authentication and Pairing (iOS/Android)\nOpcional: Google Cloud Print; WiFi Direct	Impresión, copiado y escaneo	\N	300	30	USD
502c79a9-4bb9-49e5-af0e-3ebe04fd6bf4	Konica Minolta	Bizhub C360i	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Konica_Minolta/Bizhub_C360i/bizhub-C360i-Datasheet-1.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_C360i/bizhub-C360i-front.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_C360i/bizhub-C360i-full.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_C360i/bizhub-C360i-left.png}	La Konica Minolta Bizhub C360i es una impresora multifunción color de alto rendimiento que ofrece funciones avanzadas de productividad, seguridad y conectividad. Con una velocidad de impresión de hasta 36 páginas por minuto, esta impresora puede manejar una amplia gama de tipos y tamaños de documentos, y sus capacidades avanzadas de escaneo permiten una fácil digitalización de documentos en papel. La C360i también cuenta con opciones de seguridad avanzadas, como la autenticación de usuario y el cifrado del disco duro, que garantizan la protección de la información confidencial. Con su intuitiva interfaz de pantalla táctil y sus capacidades de impresión móvil, la Bizhub C360i es una excelente opción para pequeñas y medianas empresas que buscan una solución de oficina potente y eficiente.	100.15	Oficina	t	f	t	{}	220-240 V; menos de 1.58 kW	61.5 x 68.8 x 77.9 cm (sin opciones)	Banner	11.69" x 47.2" 	Doble Carta	t	A6-SRA3	Windows 7 (32/64); Windows 8/8.1 (32/64); Windows 10 (32/64); Windows Server 2008 (32/64); Windows Server 2008 R2; Windows Server 2012; Windows Server 2012 R2; Windows Server 2016; Windows Server 2019; Macintosh OS X 10.10 o posterior; Unix; Linux; Citrix; AirPrint (iOS); Mopria (Android);\nKonica Minolta Mobile Print (iOS/Android/Windows 10 Mobile);\nMobile Authentication and Pairing (iOS/Android)\nOpcional: Google Cloud Print; WiFi Direct	Impresión, copiado y escaneo	\N	256	36	USD
f8c8dd97-d350-43a4-ab4a-5d869c571fe1	Konica Minolta	Bizhub 300i	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Konica_Minolta/Bizhub_300i/bizhub-300i-Datasheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_300i/bizhub-300i-front1.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_300i/bh-300i-side.png}	La Konica Minolta Bizhub 300i es una impresora multifunción fiable y versátil que ofrece funciones de impresión, escaneado, copia y fax de alta calidad. Con una velocidad de impresión de hasta 30 páginas por minuto y una capacidad de papel de 250 hojas, esta impresora puede manejar una amplia gama de tipos y tamaños de documentos. También cuenta con opciones de seguridad avanzadas, como autenticación de usuario y cifrado de disco duro, que garantizan la protección de la información confidencial. La Bizhub 300i es una excelente opción para pequeñas y medianas empresas que buscan una solución de oficina eficiente y rentable.	100.15	Oficina	f	f	t	{}	220-240 V; menos de 1.58 kW	61.5 x 68.8 x 77.9 mm (sin opciones)	Banner	11.69" x 47.2" 	Doble Carta	t	A6-SRA3	Windows (x32/x64): XP/Vista/7/8 Windows Server (x32/x64): 2003/2008/2008 R23 /20123 Macintosh OS X 10.6 o posterior Linux/Citrix	Impresión, copiado y escaneo	\N	300	30	USD
13a4cf53-3a92-4f76-949b-37d42aac78fd	Konica Minolta	Bizhub 360i	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Konica_Minolta/Bizhub_360i/bizhub-360i-specsheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_360i/bizhub-360i-front1.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_360i/bizhub-360i-side.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_360i/bizhub-C360i-Panel.png}	La Konica Minolta Bizhub 360i es una impresora multifunción versátil y fiable diseñada para pequeñas y medianas empresas. Con sus rápidas velocidades de impresión y escaneado, sus avanzadas funciones de seguridad y su interfaz de usuario personalizable, la Bizhub 360i puede ayudar a agilizar su flujo de trabajo documental y mejorar la productividad en el lugar de trabajo. Su gran pantalla táctil en color y su intuitivo panel de control facilitan la navegación y el manejo, mientras que su conectividad inalámbrica y sus funciones de impresión móvil permiten a los usuarios imprimir o escanear desde sus smartphones o tablets. Equipada con funciones ecológicas y bajo consumo de energía, la Bizhub 360i es una opción sostenible y rentable para las empresas que buscan reducir su impacto medioambiental. Tanto si necesita imprimir informes, facturas o presentaciones, la Bizhub 360i puede gestionar todas sus necesidades de impresión con facilidad y eficiencia, ofreciendo siempre resultados de alta calidad.	100.15	Oficina	f	f	t	{}	220-240 V; menos de 1.58 kW	61.5 x 68.8 x 77.9 cm (sin opciones)	Banner	11.69" x 47.2" 	Doble Carta	t	A6-SRA3	Windows 7 (32/64); Windows 8/8.1 (32/64); Windows 10 (32/64); Windows Server 2008 (32/64); Windows Server 2008 R2; Windows Server 2012; Windows Server 2012 R2; Windows Server 2016; Windows Server 2019; Macintosh OS X 10.10 o posterior; Unix; Linux; Citrix; AirPrint (iOS); Mopria (Android);\nKonica Minolta Mobile Print (iOS/Android/Windows 10 Mobile);\nMobile Authentication and Pairing (iOS/Android)\nOpcional: Google Cloud Print; WiFi Direct	Impresión, copiado y escaneo	\N	300	36	USD
31cbbb8e-d110-4f69-a5a1-b9cc990ceea0	Konica Minolta	Bizhub C450i	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Konica_Minolta/Bizhub_C450i/bizhub-c450i-product-datasheet-dsbls.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_C450i/bizhub-C450i-front.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_C450i/bizhub-C450i-full.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_C450i/bizhub-C450i-left1.png}	La Konica Minolta Bizhub C450i es una impresora multifunción color de alta velocidad diseñada para medianas y grandes empresas. Con una velocidad de impresión de hasta 45 páginas por minuto, esta impresora puede manejar grandes volúmenes de impresión con facilidad. La C450i ofrece una serie de funciones avanzadas, como impresión móvil, integración en la nube y opciones de seguridad avanzadas para proteger la información confidencial. La máquina también cuenta con una gran pantalla táctil de 10,1 pulgadas que proporciona una interfaz de usuario intuitiva y un fácil acceso a las funciones avanzadas de la impresora. La Konica Minolta Bizhub C450i es una excelente opción para las empresas que necesitan una impresora en color fiable y de gran volumen que ofrezca funciones avanzadas para ayudar a mejorar el flujo de trabajo y la productividad.	100.15	Oficina	t	f	t	{}	220-240 V; menos de 1.58 kW	 61.5 x 68.8 x 96.1 cm	Banner	11.69" x 47.2" 	Doble Carta	t	A6-SRA3	Windows (x32/x64): XP/Vista/7/8 Windows Server (x32/x64): 2003/2008/2008 R23 /20123 Macintosh OS X 10.6 o posterior Linux	Impresión, copiado y escaneo	\N	300	45	USD
9e4572b7-1fac-4774-a1ce-944b461b836a	Konica Minolta	Bizhub C550i	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Konica_Minolta/Bizhub_C550i/bizhub-C550i-Product-Datasheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_C550i/bizhub-C550i-full.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_C550i/bizhub-C550i-full-right.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_C550i/bizhub-C550i-left.png}	La Konica Minolta Bizhub C550i es una impresora multifunción potente y versátil diseñada para lugares de trabajo modernos con necesidades de impresión de gran volumen. Con sus capacidades de impresión y escaneado de alta velocidad, funciones de seguridad avanzadas e interfaz de usuario personalizable, la Bizhub C550i puede ayudar a las empresas a agilizar sus flujos de trabajo de documentos y aumentar la productividad. Su gran pantalla táctil en color y su intuitiva interfaz de usuario facilitan la navegación y el manejo, mientras que su conectividad inalámbrica y sus capacidades de impresión móvil permiten a los usuarios imprimir o escanear desde sus smartphones o tablets. Equipada con funciones ecológicas y bajo consumo de energía, la Bizhub C550i es una opción sostenible y rentable para las empresas que buscan reducir su impacto medioambiental. Tanto si necesita imprimir informes, folletos o materiales de marketing, la Bizhub C550i puede gestionar todas sus necesidades de impresión con facilidad y eficiencia, ofreciendo siempre resultados de alta calidad.	100.15	Oficina	t	f	t	{}	220-240 V; menos de 2 kW	61.5 x 68.8 x 96.1 cm (sin opciones)	Banner	11.69" x 47.2" 	Doble Carta	t	A6-SRA3	Windows (x32/x64): XP/Vista/7/8 Windows Server (x32/x64): 2003/2008/2008 R23 /20123 Macintosh OS X 10.6 o posterior Linux	Impresión, copiado y escaneo	\N	300	55	USD
951e3c58-4794-4dbb-9ce4-c7e0f624d6f1	Konica Minolta	Bizhub 450i	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Konica_Minolta/Bizhub_450i/bizhub-450i-Datasheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_450i/450i1.png}	La Konica Minolta Bizhub 450i es una impresora multifunción compacta y fiable diseñada para pequeñas y medianas empresas. Con sus rápidas velocidades de impresión y escaneado, su flexible manejo del papel y sus avanzadas funciones de seguridad, la Bizhub 450i puede ayudar a agilizar su flujo de trabajo documental y mejorar la productividad en el lugar de trabajo. Su intuitivo panel de control y su interfaz de usuario personalizable facilitan su manejo, mientras que su conectividad inalámbrica y sus capacidades de impresión móvil permiten a los usuarios imprimir o escanear desde cualquier lugar y en cualquier momento, utilizando sus smartphones o tablets. Equipada con funciones de ahorro de energía y diseño ecológico, la Bizhub 450i es una opción sostenible y rentable para cualquier empresa que busque reducir su impacto medioambiental. Tanto si necesita imprimir, escanear, copiar o enviar documentos por fax, la Bizhub 450i puede gestionar todas las necesidades de su oficina con facilidad y eficiencia, ofreciendo siempre resultados de alta calidad.	100.15	Oficina	f	f	t	{}	220-240 V; menos de 1.58 kW	61.5 x 68.8 x 96.1 cm (sin opciones)	Banner	11.69" x 47.2" 	Doble Carta	t	A6-SRA3	Windows 7 (32/64); Windows 8.1 (32/64); Windows 10 (32/64); Windows Server 2008 (32/64); Windows Server 2008 R2; Windows Server 2012; Windows Server 2012 R2; Windows Server 2016; Windows Server 2019; Macintosh OS X 10.10 o posterior; Linux; Konica Minolta Print Service (Android);\nKonica Minolta Mobile Print (iOS/Android);\nAirPrint (iOS); Mopria (Android); Lector NFC\nOpcional: WiFi Direct	Impresión, copiado y escaneo	\N	300	45	USD
c41e2921-a598-466e-ae44-8363d8a59aa2	Konica Minolta	Bizhub 550i	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Konica_Minolta/Bizhub_550i/bizhub-550i-Datasheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_550i/bizhub-550i-Left1.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_550i/bizhub-550i-Top1.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_550i/bizhub-550i1.png}	La Konica Minolta Bizhub 550i es una impresora multifunción versátil y de alto rendimiento diseñada para medianas y grandes empresas. Con sus rápidas velocidades de impresión y escaneado, sus avanzadas funciones de seguridad y su interfaz de usuario personalizable, la Bizhub 550i puede ayudar a agilizar su flujo de trabajo documental e impulsar la productividad en el lugar de trabajo. Su gran pantalla táctil en color y su intuitivo panel de control facilitan la navegación y el manejo, mientras que su conectividad inalámbrica y sus funciones de impresión móvil permiten a los usuarios imprimir o escanear desde sus smartphones o tablets. Equipada con funciones ecológicas y bajo consumo de energía, la Bizhub 550i es una opción sostenible y rentable para las empresas que buscan reducir su impacto medioambiental. Tanto si necesita imprimir materiales de marketing, informes o presentaciones, la Bizhub 550i puede gestionar todas sus necesidades de impresión con facilidad y eficiencia, ofreciendo siempre resultados de alta calidad.	100.15	Oficina	f	f	t	{}	220-240 V; menos de 2 kW	61.5 x 68.8 x 96.1 cm (sin opciones)	Banner	11.69" x 47.2" 	Doble Carta	t	A6-SRA3	Windows 7 (32/64); Windows 8.1 (32/64); Windows 10 (32/64); Windows Server 2008 (32/64); Windows Server 2008 R2; Windows Server 2012; Windows Server 2012 R2; Windows Server 2016; Windows Server 2019; Macintosh OS X 10.10 o posterior; Linux; Konica Minolta Print Service (Android);\nKonica Minolta Mobile Print (iOS/Android);\nAirPrint (iOS); Mopria (Android); Lector NFC\nOpcional: WiFi Direct	Impresión, copiado y escaneo	\N	300	55	USD
88e9ac56-ddbf-4df9-8720-b385d6b34335	Konica Minolta	Bizhub C650i	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Konica_Minolta/Bizhub_C650i/Konica-Minolta-bizhub-C650i-Brochure.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_C650i/bizhub-C650i-front1.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_C650i/bizhub-C650i-full-left1.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_C650i/bizhub-C650i-full1.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_C650i/bizhub-C650i-left1.png}	La Konica Minolta Bizhub C650i es una impresora multifunción de alto rendimiento diseñada para empresas con necesidades de impresión exigentes. Con sus rápidas velocidades de impresión y escaneado, su fiable manejo del papel y sus avanzadas funciones de seguridad, la Bizhub C650i puede ayudar a agilizar su flujo de trabajo documental y mejorar la productividad en el lugar de trabajo. Su gran pantalla táctil en color y su intuitivo panel de control facilitan la navegación y el manejo, mientras que su conectividad inalámbrica y sus funciones de impresión móvil permiten a los usuarios imprimir o escanear desde sus smartphones o tablets. Equipada con funciones ecológicas y bajo consumo de energía, la Bizhub C650i es una opción sostenible y rentable para las empresas que buscan reducir su impacto medioambiental. Tanto si necesita imprimir informes, folletos o presentaciones, la Bizhub C650i puede gestionar todas sus necesidades de impresión con facilidad y eficiencia, ofreciendo siempre resultados de alta calidad.	100.15	Oficina	t	f	t	{}	220-240 V; menos de 2 kW	61.5 x 68.8 x 96.1 cm (sin opciones)	Banner	11.69" x 47.2" 	Doble Carta	t	A6-SRA3	Windows 7 (32/64); Windows 8.1 (32/64); Windows 10 (32/64); Windows Server 2008 (32/64); Windows Server 2008 R2; Windows Server 2012; Windows Server 2012 R2; Windows Server 2016; Windows Server 2019; Macintosh OS X 10.10 o posterior; Linux; Konica Minolta Print Service (Android);\nKonica Minolta Mobile Print (iOS/Android);\nAirPrint (iOS); Mopria (Android); Lector NFC\nOpcional: WiFi Direct	Impresión, copiado y escaneo	\N	300	65	USD
67c95afa-6769-46c2-81cb-6b93cd7ae17d	Konica Minolta	Bizhub C750i	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Konica_Minolta/Bizhub_C750i/bizhub_C750i_Spec_Sheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_C750i/bizhub-C750i-full-left1.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_C750i/bizhub-C750i-full1.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_C750i/bizhub-C750i-left1.png}	La Konica Minolta Bizhub C750i es una impresora multifunción de gama alta diseñada para entornos de impresión de gran volumen. Con sus rápidas velocidades de impresión y escaneado, sus avanzadas funciones de seguridad y su interfaz de usuario personalizable, la Bizhub C750i puede ayudar a las empresas a agilizar su flujo de trabajo documental e impulsar la productividad. Su gran pantalla táctil en color y su intuitivo panel de control facilitan la navegación y el manejo, mientras que su conectividad inalámbrica y sus funciones de impresión móvil permiten a los usuarios imprimir o escanear desde sus smartphones o tablets. Equipada con funciones ecológicas y bajo consumo de energía, la Bizhub C750i es una opción sostenible y rentable para las empresas que buscan reducir su impacto medioambiental. Tanto si necesita imprimir materiales de marketing, informes o presentaciones, la Bizhub C750i puede gestionar todas sus necesidades de impresión con facilidad y eficiencia, ofreciendo siempre resultados de alta calidad.	100.15	Oficina	t	f	t	{}	220-240 V; menos de 2.1 kW	61.5 x 68.8 x 120.7 cm (sin opciones)	Banner	11.69" x 47.2" 	Doble Carta	t	A6-SRA3	Windows 7 (32/64); Windows 8.1 (32/64); Windows 10 (32/64); Windows Server 2008 (32/64); Windows Server 2008 R2; Windows Server 2012; Windows Server 2012 R2; Windows Server 2016; Windows Server 2019; Macintosh OS X 10.10 o posterior; Linux; Konica Minolta Print Service (Android);\nKonica Minolta Mobile Print (iOS/Android);\nAirPrint (iOS); Mopria (Android); Lector NFC\nOpcional: WiFi Direct	Impresión, copiado y escaneo	\N	300	75	USD
554c1791-a1ca-4ea8-82e1-51ee5529dfcb	Konica Minolta	Bizhub 808	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Konica_Minolta/Bizhub_808/bizhub_808_Spec_Sheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_808/bizhub-808-front.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_808/bizhub-808-full.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_808/bizhub-808-left.png}	La Konica Minolta Bizhub 808 es una impresora multifunción potente y de gran volumen diseñada para entornos de trabajo de gran actividad. Con sus rápidas velocidades de impresión y escaneado, su fiable manejo del papel y sus avanzadas funciones de seguridad, la Bizhub 808 puede ayudar a agilizar su flujo de trabajo documental y mejorar la productividad en el lugar de trabajo. Su gran pantalla táctil en color y su intuitivo panel de control facilitan la navegación y el manejo, mientras que su conectividad inalámbrica y sus funciones de impresión móvil permiten a los usuarios imprimir o escanear desde sus smartphones o tablets. Equipada con funciones ecológicas y bajo consumo de energía, la Bizhub 808 es una opción sostenible y rentable para las empresas que buscan reducir su impacto medioambiental. Tanto si necesita imprimir informes, folletos o materiales de marketing, la Bizhub 808 puede gestionar todas sus necesidades de impresión con facilidad y eficiencia, ofreciendo siempre resultados de alta calidad.	100.15	Oficina	f	f	t	{}	110-120 V; menos de 2.1 kW	67 x 82 x 123.1 cm	Banner	11.75" x 47.25"	Doble Carta	t	A5-A3	Windows (x32/x64): Vista/7/8\nWindows Server (x32/x64): 2008/2008 R2/2012/2012 R2\nMacintosh OS X 10.6/10.7/10.8/10.9/10.10\nUNIX/Linux/Citrix	Impresión, copiado y escaneo	\N	300	80	USD
d5a501cc-9642-47ad-9d9b-10d2e4405bdb	Konica Minolta	Bizhub 958	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Konica_Minolta/Bizhub_958/bizhub_958_Spec_Sheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_958/bizhub-958-front11.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_958/bizhub-958-full1.png}	La Konica Minolta Bizhub 958 es una impresora multifunción de alto rendimiento diseñada para grandes empresas con necesidades de impresión exigentes. Con sus rápidas velocidades de impresión y escaneado, su fiable manejo del papel y sus avanzadas funciones de seguridad, la Bizhub 958 puede ayudar a agilizar su flujo de trabajo documental y mejorar la productividad en el lugar de trabajo. Su gran pantalla táctil en color y su intuitivo panel de control facilitan la navegación y el manejo, mientras que su conectividad inalámbrica y sus funciones de impresión móvil permiten a los usuarios imprimir o escanear desde sus smartphones o tablets. Equipada con funciones ecológicas y bajo consumo de energía, la Bizhub 958 es una opción sostenible y rentable para las empresas que buscan reducir su impacto medioambiental. Tanto si necesita imprimir informes, folletos o presentaciones, la Bizhub 958 puede gestionar todas sus necesidades de impresión con facilidad y eficiencia, ofreciendo siempre resultados de alta calidad.	100.15	Oficina	f	f	t	{}	220-240 V; menos de 3.8 kW	67 x 82 x 123.1 cm	Banner	11.75" x 47.25"	Doble Carta	t	A5-A3	Windows (x32/x64): Vista/7/8\nWindows Server: 20083\n/2008 R2/2012/2012 R2\nMacintosh OS X 10.6/10.7/10.8/10.9/10.10\nUNIX/Linux/Citrix	Impresión, copiado y escaneo	\N	300	95	USD
4406aea9-8001-4aec-9e3c-6d4664e4b6c0	Konica Minolta	Bizhub 4050	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Konica_Minolta/Bizhub_4050/4050_Spec_Sheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_4050/bizhub-4050-front1.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_4050/bizhub-4050-full1.png}	La Konica Minolta Bizhub 4050 es una impresora multifunción diseñada para pequeñas y medianas empresas. Con su tamaño compacto y sus capacidades de impresión de alta velocidad, ofrece una solución eficiente y fiable para las necesidades diarias de impresión, escaneado y copia. Equipada con funciones avanzadas como conectividad inalámbrica, impresión móvil e impresión segura, la Bizhub 4050 es un dispositivo versátil y fácil de usar que puede agilizar el flujo de trabajo documental e impulsar la productividad en el lugar de trabajo. Su intuitivo panel de control y su interfaz de usuario personalizable también facilitan la navegación y el manejo, mientras que su bajo consumo energético y sus funciones ecológicas la convierten en una opción sostenible para cualquier empresa.	100.15	Oficina	f	t	f	{}	110-120V; menos de 1.45 kW	41.9 x 52.8 x 57.1 cm (sin opciones)	Legal	8.5" x 14"	Carta	t	Legal, Carta, A6-A4	Windows 7 (32/64); Windows 8.1 (32/64); Windows 10 (32/64);\nWindows Server 2008 (32/64); Windows Server 2008 R2;\nWindows Server 2012; Windows Server 2012 R2;\nWindows Server 2016; Windows Server 2019;\nMacintosh OS X 10.10 or later; Unix; Linux; Citrix AirPrint (iOS); Mopria (Android);\nKonica Minolta Print Service (Android);\nKonica Minolta Mobile Print (iOS/Android)\noptional: WiFi Direct;\nMobile Authentication and Pairing (iOS/Android)	Impresión, copiado y escaneo	\N	210	42	USD
2e6b2176-36a3-4ff5-a672-03d8a37dd8a9	Konica Minolta	Bizhub 364e	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Konica_Minolta/Bizhub_364e/364e_Spec_Sheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_364e/bizhub-364e-front-full1.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_364e/bizhub-364e-side-2.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_364e/bizhub-364e-side.png}	La Konica Minolta Bizhub 364e es un equipo multifunción diseñado para pequeñas y medianas empresas que requieren una solución de impresión fiable y eficiente. Con velocidades de impresión de hasta 36 páginas por minuto y una resolución de 1.200 x 1.200 ppp, esta máquina ofrece impresiones de alta calidad con una claridad y nitidez excepcionales. También cuenta con una amplia gama de funciones avanzadas, como impresión, escaneado y copia a doble cara, así como opciones de impresión segura para garantizar la protección de los documentos confidenciales. La Bizhub 364e es fácil de usar, con una interfaz intuitiva y una configuración sencilla, lo que la convierte en una excelente opción para entornos de trabajo con mucha actividad.	100.15	Oficina	f	t	f	{}	220-240 V; menos de 1.58 kW	61.5 x 68.5 x 77.9 cm (excl. ADF y bandeja inferior)	Banner	11.69" x 47.2" 	Doble Carta	t	A6-SRA3	Windows VISTA (32/64) Windows 7 (32/64) Windows 8 (32/64) Windows Server 2003 (32/64) Windows Server 2008 (32/64) Windows Server 2008 R2 Windows Server 2012 Windows Server 2012 R2 Macintosh OS X 10.x Unix, Linux, Citrix	Impresión, copiado y escaneo	\N	300	36	USD
9d2b7833-9015-4d8e-bb11-d1a44dd76152	Konica Minolta	Bizhub 308e	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Konica_Minolta/Bizhub_308e/308e%2BSpec%2BSheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_308e/bizhub-308e-front.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_308e/bizhub-308e-full.png}	La Konica Minolta Bizhub 308e es una impresora multifunción diseñada para pequeñas y medianas empresas. Con una rápida velocidad de impresión y copia de hasta 30 páginas por minuto, esta máquina puede hacer frente a las exigencias de un entorno de oficina ajetreado. Presenta una interfaz fácil de usar con una pantalla táctil en color de 7 pulgadas, que permite una navegación sencilla y el acceso a una serie de funciones que incluyen impresión, escaneado, copia y fax opcional. Con impresión a doble cara de serie y la posibilidad de imprimir desde dispositivos móviles, la Bizhub 308e es una opción fiable y eficiente para cualquier oficina.	100.15	Oficina	f	t	f	{}	220-240 V; menos de 1.58 kW	61.5 x 72.5 x 77.9 cm (sin opciones)	Banner	11.69" x 47.2" 	Doble Carta	t	A6-SRA3	Windows 7 (32/64); Windows 8/8.1 (32/64);\nWindows 10 (32/64); Windows Server 2008 (32/64);\nWindows Server 2008 R2; Windows Server 2012;\nWindows Server 2012 R2; Windows Server 2016;\nMacintosh OS X 10.8 or later; Unix; Linux; Citrix	Impresión, copiado y escaneo	\N	300	30	USD
2c4c93f3-9edc-472d-a6c5-abee35debc01	Konica Minolta	Bizhub 368e	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Konica_Minolta/Bizhub_368e/368e%2BSpec%2BBooklet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_368e/bizhub-368e-front.png}	La Konica Minolta Bizhub 368e es una impresora multifunción diseñada para pequeñas y medianas empresas. Ofrece una amplia gama de funciones que incluyen impresión, copia, escaneado y fax opcional. Con una velocidad de impresión de hasta 36 páginas por minuto, puede realizar tareas de impresión de gran volumen de forma eficiente. También cuenta con una interfaz de pantalla táctil intuitiva y capacidades de impresión móvil, lo que permite a los usuarios imprimir fácilmente desde sus teléfonos inteligentes o tabletas. La Bizhub 368e también ofrece funciones de seguridad avanzadas para proteger la información confidencial, lo que la convierte en una opción fiable y segura para cualquier empresa.	100.15	Oficina	f	t	f	{}	220-240 V; menos de 1.58 kW	61.5 x 72.5 x 77.9 cm (sin opciones)	Banner	11.69" x 47.2" 	Doble Carta	t	A6-SRA3	Windows 7 (32/64); Windows 8/8.1 (32/64);\nWindows 10 (32/64); Windows Server 2008 (32/64);\nWindows Server 2008 R2; Windows Server 2012;\nWindows Server 2012 R2; Windows Server 2016;\nMacintosh OS X 10.8 o posterior; Unix; Linux; Citrix;AirPrint (iOS); Mopria (Android); Konica Minolta Print Service\n(Android); Konica Minolta Mobile Print (iOS/Android/Windows 10\nMobile); Mobile Authentication y Pairing (iOS/Android)\nOpcional: Google Cloud Print; WiFi Direct; AirPrint (iOS); Mopria (Android); Google Cloud Print (opcional);\nWiFi Direct (opcional); Konica Minolta Print Service\n(Android); PageScope Mobile (iOS/Android)	Impresión, copiado y escaneo	\N	300	36	USD
4b4d2171-9d97-4af7-bff9-403b409584fe	Konica Minolta	Bizhub 558e	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Konica_Minolta/Bizhub_558e/bizhub_558e_Spec_Booklet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_558e/bizhub-558e-front.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_558e/bizhub-558e-full-2.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_558e/bizhub-558e-full.png}	La Konica Minolta Bizhub 558e es una impresora multifunción monocromo de alto rendimiento diseñada para grandes grupos de trabajo y entornos de oficina con mucho trabajo. Con rápidas velocidades de impresión de hasta 55 páginas por minuto y una gran variedad de funciones avanzadas, como la impresión móvil y la seguridad integrada, la Bizhub 558e es ideal para organizaciones que requieren grandes volúmenes de impresión, escaneado y copia. Además, la pantalla táctil en color de 10,1 pulgadas ofrece una interfaz de usuario intuitiva que facilita el manejo y simplifica la gestión y personalización de los flujos de trabajo.	100.15	Oficina	f	t	f	{}	220-240 V; menos de 2 kW	61.5 x 75.5 x 96.1 cm (sin opciones)	Banner	11.69" x 47.2" 	Doble Carta	t	A6-SRA3	Windows 7 (32/64); Windows 8/8.1 (32/64);\nWindows 10 (32/64); Windows Server 2008 (32/64);\nWindows Server 2008 R2; Windows Server 2012;\nWindows Server 2012 R2; Windows Server 2016;\nMacintosh OS X 10.8 o posterior; Unix; Linux; Citrix;AirPrint (iOS); Mopria (Android); Konica Minolta Print Service\n(Android); Konica Minolta Mobile Print (iOS/Android/Windows 10\nMobile); Mobile Authentication y Pairing (iOS/Android)\nOpcional: Google Cloud Print; WiFi Direct	Impresión, copiado y escaneo	\N	300	55	USD
11449233-e6f2-4989-804f-628813c89259	Konica Minolta	Bizhub C3351	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Konica_Minolta/Bizhub_C3351/bizhub-C3351-Brochure.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_C3351/bizhub-C3351-full-front.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_C3351/bizhub-C3351-left1.png}	La Konica Minolta Bizhub C3351 es una impresora multifunción en color diseñada para pequeñas y medianas empresas. Con velocidades de impresión de hasta 33 páginas por minuto tanto en color como en blanco y negro, esta impresora ofrece impresiones de alta calidad a gran velocidad. Tiene una capacidad de papel de hasta 1.100 hojas y admite varios tamaños y tipos de papel, incluidos sobres y etiquetas. La Bizhub C3351 también incluye funciones avanzadas como la impresión inalámbrica, la impresión móvil y una interfaz fácil de usar con una pantalla táctil en color de 7 pulgadas. También admite diversas medidas de seguridad para proteger sus documentos confidenciales.	100.15	Oficina	t	t	f	{}	220-240 V; Menos de 1.7 kW	55.5 x 58.4 x 60.3 cm	Legal	8.5" x 14"	Carta	t	A6-A4	Windows Vista (32/64)\nWindows 7 (32/64)\nWindows 8 (32/64)\nWindows 10 (32/64)\nWindows Server 2008 (32/64)\nWindows Server 2008 R2\nWindows Server 2012\nWindows Server 2012 R2\nWindows Server 2016\nMacintosh OS X 10.x\nLinux\nUnix\nCitrix	Impresión, copiado y escaneo	\N	210	33	USD
2e977695-2a86-46de-9d5a-d2fc10f223d9	Konica Minolta	Bizhub C364	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Konica_Minolta/Bizhub_C364/Datasheet_bizhub_C364.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_C364/bizhub-C364-front.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_C364/Sin+ti%CC%81tulo-1.png}	La Konica Minolta Bizhub C364 es una impresora multifunción que ofrece impresión, escaneado, copia y fax rápidos y fiables. Está diseñada para pequeñas y medianas empresas y grupos de trabajo que requieren una impresión de alta calidad y funciones avanzadas. La Bizhub C364 ofrece rápidas velocidades de impresión de hasta 36 páginas por minuto tanto en color como en blanco y negro, y tiene una capacidad máxima de papel de 3.650 hojas para manejar grandes trabajos de impresión. También incluye funciones como la impresión móvil, la impresión segura y la impresión automática a doble cara para ahorrar tiempo y reducir costes. Además, la Bizhub C364 tiene una interfaz fácil de usar y se puede integrar fácilmente en los sistemas de TI existentes, por lo que es una excelente opción para las empresas que buscan una solución de impresión fiable y eficiente.	100.15	Oficina	t	t	f	{}	110-120 V; menos de 1.58 kW	61.5 x 68.5 x 77.9 cm (excl. ADF y bandejas de papel inferiores)	Banner	11.69" x 47.2" 	Doble Carta	t	A6-SRA3	Windows 2000/XP/XP64\n Windows VISTA 32/64\n Windows 7 32/64\n Server 2000/2003/2003x64/2008/2008x64/2008 (R2)\n Macintosh 9.x/10.x\n Unix/Linux/Citrix	Impresión, copiado y escaneo	\N	300	36	USD
9ae848c1-8fc2-41e3-afd3-9e1993d2ccf2	Konica Minolta	Bizhub C368	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Konica_Minolta/Bizhub_C368/bizhub_C368_Spec_Sheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_C368/bizhub-C368-front.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_C368/bizhub-C368-side-default.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_C368/bizhub-C368-side.png}	La Konica Minolta Bizhub C368 es una impresora multifunción en color diseñada para pequeñas y medianas empresas. Tiene una velocidad de impresión de hasta 36 páginas por minuto y un ciclo de trabajo mensual de hasta 120.000 páginas, por lo que es una opción fiable para entornos de oficina con mucho trabajo. La C368 ofrece diversas funciones, como impresión automática a doble cara, impresión móvil y opciones de seguridad avanzadas para garantizar la protección de la información confidencial. También viene equipada con una gran pantalla táctil en color de 9 pulgadas para facilitar la navegación y el control de los trabajos de impresión. La C368 admite una amplia gama de tamaños y gramajes de papel, y sus capacidades de impresión de alta calidad la hacen adecuada para producir materiales de marketing y otros documentos profesionales.	100.15	Oficina	t	t	f	{}	110-120 V; menos de 1.5 kW	61.5 x 72.5 x 77.9 cm (sin opciones)	Banner	11.69" x 47.2" 	Doble Carta	t	A6-SRA3	Windows 2000/XP/XP64\n Windows VISTA 32/64\n Windows 7 32/64\n Server 2000/2003/2003x64/2008/2008x64/2008 (R2)\n Macintosh 9.x/10.x\n Unix/Linux/Citrix	Impresión, copiado y escaneo	\N	300	36	USD
d26fdc70-aa5a-481a-9db1-7df318dd4c2a	Konica Minolta	Bizhub C558	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Konica_Minolta/Bizhub_C558/bizhub_C558_Spec_Sheet_.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_C558/bizhub-C558-front1.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_C558/bizhub-C558-full1.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_C558/bizhub-C558-left.png}	La Konica Minolta Bizhub C558 es una impresora multifunción color de alta velocidad diseñada para oficinas con grandes necesidades de impresión. Ofrece una rápida velocidad de impresión de hasta 55 páginas por minuto, con una salida de alta calidad de hasta 1200 x 1200 ppp de resolución. La C558 incluye una gran pantalla táctil en color de 10,1 pulgadas, funciones de seguridad avanzadas y capacidades flexibles de manejo de papel con una capacidad máxima de papel de hasta 6.650 hojas. Gracias a su Wi-Fi integrado y a sus funciones de impresión móvil, la C558 permite imprimir fácilmente desde diversos dispositivos, lo que la convierte en una solución versátil y fiable para las oficinas modernas.	100.15	Oficina	t	t	f	{}	220-240 V; menos de 2 kW	61.5 x 75.5 x 96.1 cm (sin opciones)	Banner	11.69" x 47.2" 	Doble Carta	t	A6-SRA3	Windows 7 (32/64); Windows 8/8.1 (32/64);\nWindows 10 (32/64); Windows Server 2008 (32/64);\nWindows Server 2008 R2; Windows Server 2012;\nWindows Server 2012 R2; Windows Server 2016;\nMacintosh OS X 10.8 o posterior; Unix; Linux; Citrix;AirPrint (iOS); Mopria (Android); Konica Minolta Print Service\n(Android); Konica Minolta Mobile Print (iOS/Android/Windows 10\nMobile); Mobile Authentication y Pairing (iOS/Android)\nOpcional: Google Cloud Print; WiFi Direct	Impresión, copiado y escaneo	\N	300	55	USD
2ca0cda2-f282-4e59-9394-28949ee72e50	Konica Minolta	AccurioPress 6136	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Konica_Minolta/AccurioPress_6136/6136_Spec_Sheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/AccurioPress_6136/accuriopress-6136-front1.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/AccurioPress_6136/accuriopress-6136-full-front1.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/AccurioPress_6136/accuriopress-6136-top-full1.png}	La Konica Minolta AccurioPress 6136 es una prensa de impresión digital de alto rendimiento diseñada para impresores comerciales y departamentos de impresión en planta. Con sus rápidas velocidades de impresión, su avanzada gestión del color y sus capacidades de manejo de soportes, la AccurioPress 6136 puede producir impresiones de alta calidad con una precisión y consistencia excepcionales. Equipada con tecnologías innovadoras como el tóner Simitri HDE y un sistema de doble sensor, esta prensa digital ofrece imágenes y texto de alta calidad con un detalle asombroso, lo que la hace ideal para imprimir materiales de marketing, libros, manuales y otros documentos profesionales. Sus avanzadas funciones de automatización, como la calibración automática del color y el ajuste del registro, ayudan a reducir los residuos y a aumentar la productividad, mientras que su interfaz de usuario personalizable y su integración con el software de gestión de flujos de trabajo facilitan su manejo y su integración en los flujos de trabajo existentes. Con su rendimiento y fiabilidad superiores, la AccurioPress 6136 es una opción excelente para las empresas que buscan ampliar sus capacidades de impresión y obtener resultados de alta calidad.	100.15	Produccion	f	f	t	{}	220-240 V; 20A; 	99 x 91 x 145.4 cm	Tabloide Plus	13" x 19.2"	Tabloide Plus	t	A6-SRA3	PCL, PS, complemento PS:\nWindows 7*1\n/8.1*1\n/10*1\nWindows Server 2008/2008 R2/2012/\n2012 R2/2016\nMac OS X 10.8/10.9/10.10/10.11/10.12	Impresión, copiado y escaneo	\N	300	136	USD
791c4bab-d3e0-4304-bb30-f8b35ed42b41	Konica Minolta	AccurioPress 6136P	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Konica_Minolta/AccurioPress_6136P/6136P_Spec_Sheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/AccurioPress_6136P/accuriopress-6136P-front1.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/AccurioPress_6136P/accuriopress-6136P-full1.png}	La Konica Minolta AccurioPress 6136P es una impresora de producción de alto rendimiento diseñada para entornos de impresión comercial y en planta. Con sus rápidas velocidades de impresión, su avanzada gestión del color y sus capacidades de manejo de soportes, la AccurioPress 6136P puede producir impresiones de alta calidad con una precisión y consistencia excepcionales. Equipada con tecnologías innovadoras como el tóner Simitri HDE y un sistema de doble sensor, esta prensa digital ofrece imágenes y texto de alta calidad con un detalle asombroso, lo que la hace ideal para imprimir materiales de marketing, libros, manuales y otros documentos profesionales. Sus avanzadas funciones de automatización, como la calibración automática del color y el ajuste del registro, ayudan a reducir los residuos y a aumentar la productividad, mientras que su interfaz de usuario personalizable y su integración con el software de gestión de flujos de trabajo facilitan su manejo y su integración en los flujos de trabajo existentes. Con su rendimiento y fiabilidad superiores, la AccurioPress 6136P es una opción excelente para las empresas que buscan ampliar sus capacidades de impresión y obtener resultados de alta calidad.	100.15	Produccion	f	f	t	{}	220-240 V; 20A; 	99 x 90.9 x 144.7 cm	Tabloide Plus	13" x 19.2"	Tabloide Plus	t	A6-SRA3	PCL, PS, PS Plug-in:\nWindows 7*1\n/8.1*1\n/10*1\nWindows Server 2008/2008R2/2012/2012R2/2016\nMac OS X 10.8 /10.9/10.10/10.11/10.12	Impresión, copiado y escaneo	\N	300	136	USD
d3cb30bd-ec33-40b5-8b89-54d067523d7a	Konica Minolta	AccurioPress 6120	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Konica_Minolta/AccurioPress_6120/6120_Spec_Sheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/AccurioPress_6120/accuriopress-6120-front.png}	La Konica Minolta AccurioPress 6120 es una prensa de impresión digital de alto rendimiento diseñada para imprentas comerciales y departamentos de impresión en planta. Con sus rápidas velocidades de impresión, su avanzada gestión del color y sus capacidades de manejo de soportes, la AccurioPress 6120 puede producir impresiones de alta calidad con una precisión y consistencia excepcionales. Equipada con tecnologías innovadoras como el tóner Simitri HDE y un sistema de doble sensor, esta prensa digital ofrece imágenes y texto de alta calidad con un detalle asombroso, lo que la hace ideal para imprimir materiales de marketing, libros, manuales y otros documentos profesionales. Sus avanzadas funciones de automatización, como la calibración automática del color y el ajuste del registro, ayudan a reducir los residuos y a aumentar la productividad, mientras que su interfaz de usuario personalizable y su integración con el software de gestión de flujos de trabajo facilitan su manejo y su integración en los flujos de trabajo existentes. Con su rendimiento y fiabilidad superiores, la AccurioPress 6120 es una opción excelente para las empresas que buscan ampliar sus capacidades de impresión y obtener resultados de alta calidad.	100.15	Produccion	f	f	t	{}	220-240 V; 20A; 	99 x 90.9 x 144.7 cm	Tabloide Plus	13" x 19.2"	Tabloide Plus	t	A6-SRA3	PCL, PS, PS Plug-in:\nWindows 7*1\n/8.1*1\n/10*1\nWindows Server 2008/2008R2/2012/2012R2/2016\nMac OS X 10.8 /10.9/10.10/10.11/10.12	Impresión, copiado y escaneo	\N	300	120	USD
0993d7de-ee0e-42c6-b567-46bfb013e40e	Konica Minolta	Bizhub Press 2250	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Konica_Minolta/Bizhub_Press_2250/bizhub_PRESS_2250P_Spec_Sheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_Press_2250/bizhub-press-2250P.png}	La Konica Minolta Bizhub Press 2250 es una impresora de producción de alto volumen diseñada para entornos de impresión comercial. Con sus rápidas velocidades de impresión, su avanzada gestión del color y sus capacidades de manejo de soportes, la Bizhub Press 2250 puede producir impresiones de alta calidad con una precisión y consistencia excepcionales. Equipada con tecnologías innovadoras como el tóner Simitri HD_ y un cabezal de impresión LED de alta resolución, esta impresora de producción ofrece imágenes y texto de alta calidad con un detalle asombroso, lo que la hace ideal para imprimir materiales de marketing, libros, manuales y otros documentos profesionales. Sus avanzadas funciones de automatización, como la calibración automática del color y el ajuste del registro, ayudan a reducir los residuos y a aumentar la productividad, mientras que su interfaz de usuario personalizable y su integración con el software de gestión de flujos de trabajo facilitan su funcionamiento y su integración en los flujos de trabajo existentes. Con su rendimiento y fiabilidad superiores, la Bizhub Press 2250 es una excelente opción para las empresas que buscan ampliar sus capacidades de impresión y obtener resultados de alta calidad.	100.15	Produccion	f	f	t	{}	220-240 V; 25A; 	300 x 206 x 123.3 cm	Tabloide Plus	13" x 19.2"	Tabloide Plus	t	A6-SRA3	\N	Impresión, copiado y escaneo	\N	350	250	USD
78c61b46-4fab-489a-a2fa-cb9e10432907	Konica Minolta	Bizhub PRO 1100	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Konica_Minolta/Bizhub_PRO_1100/bizhub_PRO_1100_Spec_Sheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_PRO_1100/bizhub-pro-1100-front.png}	La Konica Minolta Bizhub PRO 1100 es una impresora monocromo de producción de gran volumen diseñada para entornos de impresión profesionales. Con una velocidad de impresión de hasta 100 páginas por minuto y una resolución máxima de 1200 x 1200 DPI, la Bizhub PRO 1100 puede producir impresiones de alta calidad con una precisión y consistencia excepcionales. Sus capacidades avanzadas de manejo de papel, incluyendo una bandeja de papel de gran capacidad y una gama de opciones de acabado, facilitan la impresión eficiente de trabajos de impresión complejos y diversos. La impresora también se caracteriza por su fácil manejo con una gran pantalla táctil en color y una interfaz personalizable, lo que permite una fácil integración en los flujos de trabajo existentes. La Bizhub PRO 1100 es ideal para imprimir una gran variedad de documentos como manuales, informes y folletos en grandes volúmenes, por lo que es adecuada para empresas que requieren capacidades de impresión rápidas y eficientes. Con su rendimiento y fiabilidad superiores, la Konica Minolta Bizhub PRO 1100 es una excelente opción para las empresas que buscan mejorar sus capacidades de impresión y agilizar sus procesos de impresión.	100.15	Produccion	f	t	f	{}	208-240 V; 16A; 	99.1 x 90.8 x 116.2 cm	Doble Carta	11" x 17"	Doble Carta	t	A6-SRA3	Windows: Windows 7, Windows 8, Windows 8.1, Windows 10, Windows Server 2008, Windows Server 2008 R2, Windows Server 2012, Windows Server 2012 R2, Windows Server 2016, Windows Server 2019; Macintosh: Mac OS X 10.8 or later; Linux: RedHat Enterprise Linux 6.5/6.6/7.0, SUSE Linux Enterprise Desktop 11 SP3, SUSE Linux Enterprise Desktop 12	Impresión, copiado y escaneo	\N	350	100	USD
fb1b1f43-468d-406e-a009-4db9639e15c2	Kyocera	ECOSYS M2040dn	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Kyocera/ECOSYS_M2040id/Kyocera_M2040dn_DataSheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Kyocera/ECOSYS_M2040id/ECOSYS-M2040dn-angled.png}	Esta ECOSYS profesional combina funciones de escaneo profesional con una velocidad óptima de impresión y de copia. Dirigida a grupos de trabajo de tamaño medianos y pequeños.	100.15	Oficina	f	f	t	{}	110-120 V; 661 W	41.7 x 41.2 x 43.7 cm	Legal	8.5" x 14"	Carta	t	Legal, Carta, A6-A4, B5, B6, Tamaños Personalizados	Todos los sistemas operativos de Windows, MAC OS X versión 10.5 o superior, Unix, Linux así como otros sistemas operativos bajo petición	Impresión, copiado y escaneo	\N	220	40	USD
6ba2cce9-ee68-47b3-89c4-5a01172ccf60	Kyocera	ECOSYS M2640idw	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Kyocera/ECOSYS_M2640idw/Kyocera_M2640idw_Datasheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Kyocera/ECOSYS_M2640idw/ECOSYS-M2640idw-front.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Kyocera/ECOSYS_M2640idw/ECOSYS-M2640idw-side.png}	Un gran avance en productividad: la M2640idw combina un rendimiento sobresaliente con gran variedad de funcionalidades. Pensada para grupos de trabajo pequeños y medianos.	100.15	Oficina	f	f	t	{}	110-120 V; 661 W	41.7 x 41.2 x 43.7 cm	Legal	8.5" x 14"	Carta	t	Legal, Carta, A6-A4, B5, B6, Tamaños Personalizados	Todos los sistemas operativos de Windows, MAC OS X versión 10.5 o superior, Unix, Linux así como otros sistemas operativos bajo petición	Impresión, copiado y escaneo	\N	220	40	USD
83c760eb-4ad1-4f25-806e-737bdf8ea806	Kyocera	ECOSYS M3145idn	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Kyocera/ECOSYS_M3145idn/Kyocera_M3145idn_Datasheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Kyocera/ECOSYS_M3145idn/ECOSYS-M3145idn-front.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Kyocera/ECOSYS_M3145idn/ECOSYS-M3145idn-side.png}	Esta multifuncional está hecha para equipos dinámicos (pequeños a grandes) con altas exigencias de fiabilidad y productividad, al tiempo que ofrece costes de funcionamiento excepcionalmente bajos.	100.15	Oficina	f	f	t	{}	110-120 V; 630 W	47.5 x 47.6 x 57.5 cm	Legal	8.5" x 14"	Carta	t	Legal, Carta, A6-A4, B5, B6, Tamaños Personalizados	Todos los sistemas operativos de Windows, MAC OS X versión 10.5 o superior, Unix, Linux así como otros sistemas operativos bajo petición	Impresión, copiado y escaneo	\N	220	45	USD
3d452d38-ccef-4fb9-9f5b-54e6e0cb2763	Kyocera	ECOSYS M3645idn	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Kyocera/ECOSYS_M3645idn/Kyocera_M3645idn_Datasheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Kyocera/ECOSYS_M3645idn/ECOSYS-M3645idn-full-front.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Kyocera/ECOSYS_M3645idn/ECOSYS-M3645idn-side.png}	Esta multifuncional está hecha para equipos dinámicos (pequeños a grandes) con altas necesidades de fiabilidad y productividad, al tiempo que ofrece costes de funcionamiento excepcionalmente bajos.	100.15	Oficina	f	f	t	{}	110-120 V; 630 W	47.5 x 47.6 x 57.5 cm	Legal	8.5" x 14"	Carta	t	Legal, Carta, A6-A4, B5, B6, Tamaños Personalizados	Todos los sistemas operativos de Windows, MAC OS versiones 10.8 o superior, UNIX, LINUX, así como otros sistemas operativos bajo petición	Impresión, copiado y escaneo	\N	220	45	USD
abe57c4d-599e-4f0d-ab28-65301a710c82	Kyocera	ECOSYS M3655idn	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Kyocera/ECOSYS_M3655idn/Kyocera_M3655idn_Datasheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Kyocera/ECOSYS_M3655idn/ECOSYS-M3655idn-front.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Kyocera/ECOSYS_M3655idn/ECOSYS-M3655idn-side.png}	Esta multifuncional es perfecta para equipos dinámicos con altas exigencias de productividad y eficiencia de software, al tiempo que ofrece costes de funcionamiento excepcionalmente bajos.	100.15	Oficina	f	f	t	{}	110-120 V; 731 W	48 x 49.5 x 59 cm	Legal	8.5" x 14"	Carta	t	Legal, Carta, A6-A4, B5, B6, Tamaños Personalizados	Todos los sistemas operativos de Windows, MAC OS versiones 10.8 o superior, UNIX, LINUX, así como otros sistemas operativos bajo petición	Impresión, copiado y escaneo	\N	220	55	USD
2b449193-e4c5-4b9c-b018-8fdd9dda45be	Kyocera	ECOSYS M5526cdn	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Kyocera/ECOSYS_M5526cdn/ECOSYS_M5526cdn_datasheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Kyocera/ECOSYS_M5526cdn/ECOSYS-M5526cdn-eco.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Kyocera/ECOSYS_M5526cdn/ECOSYS-M5526cdn-left.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Kyocera/ECOSYS_M5526cdn/ECOSYS-M5526cdn-parts.png}	Este equipo combina la mejor calidad de color con bajos costes de funcionamiento que facilitan los flujos de trabajo de tu oficina.	100.15	Oficina	t	f	t	{}	110-120 V; 375 W	41.7 x 42.9 x 49.5 cm	Legal	8.5" x 14"	Carta	t	Legal, Carta, A6-A4, B5, B6, Tamaños Personalizados	Todos los sistemas operativos de Windows, MAC OS versiones 10.8 o superior, UNIX, LINUX, así como otros sistemas operativos bajo petición	Impresión, copiado y escaneo	\N	220	26	USD
cc0263a6-a9d3-4ab7-92c2-5ab9fa150bb3	Kyocera	ECOSYS M5526cdw	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Kyocera/ECOSYS_M5526cdw/ECOSYS_M5526cdw_datasheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Kyocera/ECOSYS_M5526cdw/ECOSYS-M5526cdw-eco.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Kyocera/ECOSYS_M5526cdw/ECOSYS-M5526cdw-panel.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Kyocera/ECOSYS_M5526cdw/ECOSYS-M5526cdw-parts.png}	Este equipo combina la mejor calidad de color con buenos costes de funcionamiento que facilitan los flujos de trabajo de tu oficina.	100.15	Oficina	t	f	t	{}	110-120 V; 375 W	41.7 x 42.9 x 49.5 cm	Legal	8.5" x 14"	Carta	t	Legal, Carta, A6-A4, B5, B6, Tamaños Personalizados	Todos los sistemas operativos de Windows, MAC OS versiones 10.8 o superior, UNIX, LINUX, así como otros sistemas operativos bajo petición	Impresión, copiado y escaneo	\N	220	26	USD
2a3b4c0e-61f7-4de5-9539-e0b3f14e039e	Kyocera	ECOSYS M6630cidn	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Kyocera/ECOSYS_M6630cidn/ECOSYS_M6630cidn_datasheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Kyocera/ECOSYS_M6630cidn/ECOSYS-M6630cidn-front.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Kyocera/ECOSYS_M6630cidn/ECOSYS-M6630cidn-full-left.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Kyocera/ECOSYS_M6630cidn/ECOSYS-M6630cidn-full-right.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Kyocera/ECOSYS_M6630cidn/ECOSYS-M6630cidn-left.png}	Este dispositivo de color A4 está diseñado específicamente para grupos de trabajo medianos, ofreciendo fiabilidad y una rápida velocidad de 30 ppm. Incluye fax.	100.15	Oficina	t	f	t	{}	110-120 V; 496 W	47.5 x 55.8 x 61.6 cm	Legal	8.5" x 14"	Carta	t	Legal, Carta, A6-A4, B5, B6, Tamaños Personalizados	Todos los sistemas operativos de Windows, MAC OS versiones 10.8 o superior, UNIX, LINUX, así como otros sistemas operativos bajo petición	Impresión, copiado y escaneo	\N	220	30	USD
ec8e6bc9-f667-476f-8f60-eebe3410385a	Kyocera	TASKalfa 308ci	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Kyocera/TASKalfa_308ci/TASKalfa_308ci_datasheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Kyocera/TASKalfa_308ci/TASKalfa-308ci-front.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Kyocera/TASKalfa_308ci/TASKalfa-308ci-side.png}	Una potente multifuncional A4 con capacidad para 30 ppm. Es un dispositivo perfecto para pequeños y medianos grupos de trabajo, ofrece una alta durabilidad y flexibilidad.	100.15	Oficina	t	f	t	{}	110-120 V; 465 W	55 × 50.75 × 73.66 cm	Legal	8.5" x 14"	Carta	t	Legal, Carta, A6-A4, B5, B6, Tamaños Personalizados	Todos los sistemas operativos de Windows, MAC OS versiones 10.8 o superior, UNIX, LINUX, así como otros sistemas operativos bajo petición	Impresión, copiado y escaneo	\N	220	30	USD
f8dbb65c-9a6c-43a5-9698-84e7d9daf05b	Kyocera	TASKalfa 4004i	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Kyocera/TASKalfa_4004i/TASKalfa_4004i_Datasheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Kyocera/TASKalfa_4004i/TASKalfa-4004i-full-basic-front.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Kyocera/TASKalfa_4004i/TASKalfa-4004i-full-front.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Kyocera/TASKalfa_4004i/TASKalfa-4004i-full-side.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Kyocera/TASKalfa_4004i/TASKalfa-4004i-semifull-front.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Kyocera/TASKalfa_4004i/TASKalfa-4004i-side.png}	Minimice el tiempo de inactividad y optimice los flujos de trabajo con esta veloz impresora multifunción B&N. Disfrute de una fiabilidad, flexibilidad y uniformidad inigualables a 40 páginas por minuto.	100.15	Oficina	f	f	t	{}	110-120 V; 490 W	60.19 x 66.52 x 79.01 cm	Banner	12" x 48"	Tabloide	t	Legal, Carta, A6-A4, B5, B6, Tamaños Personalizados	Windows: (32 y 64 bits), Windows 7/8.1/10/Server 2012/Server 2012 R2/Server 2016/Server 2019 o poterior; Mac OS X v10.0 o posterior; Chrome OS; Linux.	Impresión, copiado y escaneo	\N	300	40	USD
a348c297-b557-4658-906d-0cad60ce749f	Kyocera	TASKalfa 5004i	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Kyocera/TASKalfa_5004i/TASKalfa_5004i_Datasheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Kyocera/TASKalfa_5004i/TASKalfa-5004i-full-front.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Kyocera/TASKalfa_5004i/TASKalfa-5004i-full-side.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Kyocera/TASKalfa_5004i/TASKalfa-5004i-semifull-front.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Kyocera/TASKalfa_5004i/TASKalfa-5004i-side.png}	La TASKalfa 5004i ofrece una experiencia realmente única gracias a sus funciones de IA integradas, su alto nivel de seguridad y su inmejorable fiabilidad. Independientemente del sector o tamaño de empresa, benefíciate de unas impresiones nítidas, un escaneado de alta velocidad y la más intuitiva interfaz de usuario.	100.15	Oficina	f	f	t	{}	110-120 V; 740 W	60.2  × 66.5  × 79 cm	Doble Carta	11.69" x 18"	Doble Carta	t	Legal, Carta, A6-A4, B5, B6, Tamaños Personalizados	Todos los sistemas operativos actuales de Windows, Mac OS X versiones 10.9 o superior, UNIX, LINUX, así como otros sistemas operativos bajo petición	Impresión, copiado y escaneo	\N	300	50	USD
ad7454a9-50ec-4f39-881a-8357e217be0c	Kyocera	TASKalfa 4054ci	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Kyocera/TASKalfa_4054ci/TASKalfa_4054ci_Datasheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Kyocera/TASKalfa_4054ci/TASKalfa-4054ci-full-front.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Kyocera/TASKalfa_4054ci/TASKalfa-4054ci-full-side.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Kyocera/TASKalfa_4054ci/TASKalfa-4054ci-side.png}	La TASKalfa 4054ci es la solución perfecta para un entorno de trabajo avanzado. Con opciones de seguridad mejoradas, impresión de alta calidad, manejo flexible del papel y opciones de acabado, este dispositivo es un compañero de trabajo ideal.	100.15	Oficina	t	f	t	{}	110-120 V; 990 W	60.2 × 66.5 × 79 cm	Doble Carta	12.59" x 17.71"	Doble Carta	t	Legal, Carta, A6-A4, B5, B6, Tamaños Personalizados	Todos los sistemas operativos actuales de Windows, Mac OS X versiónes 10.9 o superior, UNIX LINUX, así como otros sistemas operativos bajo petición	Impresión, copiado y escaneo	\N	300	40	USD
74b68457-10dd-47b1-9aea-0924cafc2d68	Kyocera	TASKalfa 5054ci	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Kyocera/TASKalfa_5054ci/TASKalfa_5054i_Datasheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Kyocera/TASKalfa_5054ci/TASKalfa-5054i-semifull-front.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Kyocera/TASKalfa_5054ci/TASKalfa-5054i-semifull-side.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Kyocera/TASKalfa_5054ci/TASKalfa-5054i-full-side.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Kyocera/TASKalfa_5054ci/TASKalfa-5054i-side.png}	La TASKalfa 5054ci le dará acceso a una fiabilidad insuperable, funciones de IA integradas y altos niveles de seguridad, lo que la convierte en una solución realmente única para las cambiantes necesidades de las empresas, independientemente de su sector o tamaño.	100.15	Oficina	t	f	t	{}	110-120 V; 990 W	60.2 × 66.5 × 79 cm	Doble Carta	12.59" x 17.71"	Doble Carta	t	Legal, Carta, A6-A4, B5, B6, Tamaños Personalizados	Todos los sistemas operativos actuales de Windows, Mac OS X versiónes 10.9 o superior, UNIX LINUX, así como otros sistemas operativos bajo petición	Impresión, copiado y escaneo	\N	300	55	USD
99a59835-1d68-4158-af7c-99fb65a8dca6	Epson	WorkForce Pro WF-M5799	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Epson/WorkForce_Pro_WF-M5799/Epson_WorkForce_M5799_Datasheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Epson/WorkForce_Pro_WF-M5799/Epson-WorkForce-Pro-WF-M5799-front.png}	La WorkForce WF-M5799, con tecnología de PrecisionCore, ofrece una impresora multifuncional compacta con hasta un 60 por ciento menos de costos de impresión que las impresoras láser monocromáticas. La WF-M5799 incluye un innovador sistema de bolsa de tinta reemplazable para minimizar las intervenciones. Diseñado para las necesidades de su departamento de trabajo, imprima documentos de calidad profesional.	100.15	Inyeccion de Tinta	f	f	t	{}	110-240 V; 23 W	42.5 x 53.5 x 35.7 cm (con bandeja de papel)	Legal	8.5" x 14"	Carta	t	Legal, Carta, A6-A4, B5, B6, Tamaños Personalizados	Windows 10 (32-bit, 64-bit), Windows 8.1, Windows 8 (32-bit, 64-bit), Windows 7 (32-bit, 64-bit), Windows Vista (32-bit, 64-bit), Windows® XP SP313 (32-bit), Windows® XP Professional x64 Edition, Windows Server 2016, Windows Server 2012 R2, Windows Server 2012, Windows Server 2008 R2, Windows Server 2008, Windows Server 2003 R2, Windows Server 2003, Mac OS X 10.6.8 y MacOS 10.13.x	Impresión, copiado y escaneo	\N	256	34	USD
9762acc2-920c-4a28-b46e-fd1a9d7f843b	Epson	WorkForce Pro WF-C869R	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Epson/WorkForce_Pro_WF-C869R/Epson_WorkForce_C869R_Datasheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Epson/WorkForce_Pro_WF-C869R/Epson-WorkForce-Pro-WF-C869R-front.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Epson/WorkForce_Pro_WF-C869R/Epson-WorkForce-Pro-WF-C869R-full-front.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Epson/WorkForce_Pro_WF-C869R/Epson-WorkForce-Pro-WF-C869R-full-side.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Epson/WorkForce_Pro_WF-C869R/Epson-WorkForce-Pro-WF-C869R-side.png}	La impresora multifuncional WorkForce Pro WF-C869R, ideal para grupos de trabajo que desean aumentar su productividad, ofrece impresión a color a muy bajo costo. Su sistema de bolsas de tinta reemplazables rinde hasta 86000 páginas sin cambiar la tinta, lo que significa menos intervenciones y menos molestias. Acelera las impresiónes de calidad profesional hasta 35ppm negro/color  y escanea documentos hasta 25 paginas por minuto. Con impresiónes de 33 x 48 cm (13 "x 19"), una capacidad de papel total de 1835 hojas e impresión dúplex automática, la WF-C869R tiene la versatilidad que los grupos de trabajo necesitan. Además, la plataforma abierta de Epson, permite la integración perfecta con aplicaciones empresariales basadas en la Web, como PaperCut MF entre otras.	100.15	Inyeccion de Tinta	t	f	t	{}	110-240 V; 40 W	78.7 x 86.6 x 69.9 cm	Banner	13" x 47"	Tabloide Plus	t	Legal, Carta, A6-A4, B5, B6, Tamaños Personalizados	Windows 10 (32-bit, 64-bit), Windows 8.1, Windows 8 (32-bit, 64-bit), Windows 7 (32-bit, 64-bit), Windows Vista (32-bit, 64-bit), Windows® XP SP313 (32-bit), Windows® XP Professional x64 Edition, Windows Server 2016, Windows Server 2012 R2, Windows Server 2012, Windows Server 2008 R2, Windows Server 2008, Windows Server 2003 R2, Windows Server 2003, Mac OS X 10.6.8 y MacOS 10.13.x	Impresión, copiado y escaneo	\N	256	35	USD
e2c5e78a-7e7e-4081-8044-423381800561	Epson	WorkForce Enterprise WF-C17590	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Epson/WorkForce_Enterprise_WF-C17590/Epson_WorkForce_C17590_Datasheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Epson/WorkForce_Enterprise_WF-C17590/editWorkForce-Enterprise-WF-C17590-front.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Epson/WorkForce_Enterprise_WF-C17590/Sin_ti%CC%81tulo-4.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Epson/WorkForce_Enterprise_WF-C17590/WorkForce-Enterprise-WF-C17590-panel.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Epson/WorkForce_Enterprise_WF-C17590/WorkForce-Enterprise-WF-C17590-side.png}	La multifuncional a color WorkForce Enterprise WF-C17590 está diseñada para aumentar la productividad, imprime a la increíble velocidad de 75 ppm ISO. Impulsada por la tecnología de cabezal fijo en línea - PrecisionCore Line Head ofrece rápidas velocidades con resultados de excelente calidad. Adaptable a sus necesidades, la WF-C17590 imprime hojas de formato hasta A3_, admite bandejas de papel adicionales con una capacidad máxima de papel de 5350 páginas y cuenta con opciones de finalizado profesional para apilar, grapar y más (se vende par separado). Además, soporta las soluciones de administración de impresión más importantes. lmprima desde dispositivos móviles con Epson Connect™ o escanee a la nube a través de una pantalla táctil fácil de usar.	100.15	Inyeccion de Tinta	t	f	t	{}	110-240 V; 180 W	67.4 x 75.7 x 123.1 cm	Banner	13" x 47"	Tabloide Plus	t	Legal, Carta, A6-A4, B5, B6, Tamaños Personalizados	Windows 10 (32-bit, 64-bit), Windows 8.1, Windows 8 (32-bit, 64-bit), Windows 7 (32-bit, 64-bit), Windows Vista (32-bit, 64-bit), Windows® XP SP313 (32-bit), Windows® XP Professional x64 Edition, Windows Server 2016, Windows Server 2012 R2, Windows Server 2012, Windows Server 2008 R2, Windows Server 2008, Windows Server 2003 R2, Windows Server 2003, Mac OS X 10.6.8 y MacOS 10.13.x	Impresión, copiado y escaneo	\N	350	75	USD
78d795bd-6deb-4999-b772-96010b01525e	Epson	WorkForce Enterprise WF-C20590	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Epson/WorkForce_Enterprise_WF-C20590/Epson_WorkForce_C20590_Datasheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Epson/WorkForce_Enterprise_WF-C20590/WorkForce-Enterprise-WF-C20590-front.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Epson/WorkForce_Enterprise_WF-C20590/WorkForce-Enterprise-WF-C20590-full-side.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Epson/WorkForce_Enterprise_WF-C20590/WorkForce-Enterprise-WF-C20590-full.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Epson/WorkForce_Enterprise_WF-C20590/WorkForce-Enterprise-WF-C20590-side.png}	La impresora multifuncional a color WF-C20590 revoluciona la productividad en las oficinas a través de impresiónes a 100 ISO ppm, la más rápida de su clase. Impulsada por la tecnología de cabezal fijo en línea - PrecisionCore Line Head, la multifuncional departamental combina una velocidad revolucionaria con calidad de impresión brillante. Adaptable a sus necesidades, la WF-C20590 imprime hojas de formato hasta A3_, admite bandejas de papel adicionales con una capacidad máxima de papel de 5350 páginas y cuenta con opciones de finalizado profesional para apilar, grapar, y más (se venden por separado). Además, soporta las soluciones de gestión de impresión más importantes. Imprima desde dispositivos móviles con Epson Connect™  o escanee a la nube a través de una pantalla táctil fácil de usar. 	100.15	Inyeccion de Tinta	t	f	t	{}	110-240 V; 180 W	67.4 x 75.7 x 123.1 cm	Banner	13" x 47"	Tabloide Plus	t	Legal, Carta, A6-A4, B5, B6, Tamaños Personalizados	Windows 10 (32-bit, 64-bit), Windows 8.1, Windows 8 (32-bit, 64-bit), Windows 7 (32-bit, 64-bit), Windows Vista (32-bit, 64-bit), Windows® XP SP313 (32-bit), Windows® XP Professional x64 Edition, Windows Server 2016, Windows Server 2012 R2, Windows Server 2012, Windows Server 2008 R2, Windows Server 2008, Windows Server 2003 R2, Windows Server 2003, Mac OS X 10.6.8 y MacOS 10.13.x	Impresión, copiado y escaneo	\N	350	100	USD
7e127a4f-f687-462d-96e5-d700382a4717	Epson	ColorWorks C7500G	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Epson/ColorWorks_C7500G/Epson_Colorworks_C7500G_Datasheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Epson/ColorWorks_C7500G/ColorWorks-C7500G-front.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Epson/ColorWorks_C7500G/ColorWorks-C7500G-front2.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Epson/ColorWorks_C7500G/Colorworks-C7500G-parts.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Epson/ColorWorks_C7500G/ColorWorks-C7500G-side.png}	La impresora Epson ColorWorks C7500G presenta lo último en impresión para bajos lotes de etiquetas en color. Cubre tus necesidades de impresiones personalizadas en tu propia oficina. El modelo C7500G permite la impresión de etiquetas en una sola etapa, reduciendo los costos de pre-impresión y almacenamiento.	100.15	Etiquetas	t	f	t	{}	110-240 V; 60 W	39.2 x 59.8 x 39.7 cm	4.09"	4.09"	Rollo 4	f	Rollo (2" - 4.25")	Microsoft Windows XP 32-bit (SP3)/64-bit (SP2), Vista 32-bit/64-bit(SP2), Windows 7 32-bit/64-bit (SP1), Windows 8 32-bit/64-bit, Windows Server 2012, Windows® Server 2012 R2, Windows Server 2008 (32-bit, 64‐bit), Windows Server 2003 R2 (32-bit)	Impresión	\N	190	300	USD
376920f7-a9fc-4565-beda-c802e3f93b7a	Epson	ColorWorks C6000AU	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Epson/ColorWorks_C6000AU/Epson_Colorworks_C6000_Datasheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Epson/ColorWorks_C6000AU/Colorworks-C6000AU-front.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Epson/ColorWorks_C6000AU/Colorworks-C6000AU-side.png}	La primera impresora diseñada específicamente como un paso más allá en color para impresoras de transferencia térmica en blanco y negro. La impresora de inyeccion de tinta ColorWorks CW-C6000A puede producir etiquetas a color de 4", a pedido, a un precio comparable. Diseñada para aplicaciones urgentes, esta confiable impresora rapidamente imprime etiquetas de hasta 5" por segundo. Con una resolución de hasta 1200 ppp, la CW-C6000A produce imágenes nítidas comparables a las etiquetas preimpresas. Compatible con ZPL II, SAP y más, y diseñada para adaptarse a la administración remota de impresoras, esta versátil impresora ofrece una integración perfecta con su flujo de trabajo existente. Viene con un cortador automático para crear etiquetas de longitud variable y permitir una fácil separación del trabajo.	100.15	Etiquetas	t	f	t	{}	110-240 V; 60 W	34 x 56.5 x 32.6 cm	4.25"	4.25"	Rollo 4.25	f	Rollo (1" - 4.5")	Windows 10, 8.1, 8.7, 7 SP1, Vista SP2, Server, Mac 10.6.8 o superior y Linux	Impresión	\N	236	127	USD
2e91a892-afb3-4014-b41e-521521fdb4a9	Konica Minolta	Bizhub C3350i	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Konica_Minolta/Bizhub_C3350i/konica-minolta-a4-bizhub-c3350i.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_C3350i/bizhub-C3350i-full-front.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_C3350i/bizhub-C3350i-full-side.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_C3350i/bizhub-C3350i-left.png}	La Konica Minolta Bizhub C3350i es una impresora multifunción compacta y versátil diseñada para pequeñas y medianas empresas que requieren capacidades de impresión, escaneado y copia de alta calidad. Con una velocidad de impresión de hasta 33 páginas por minuto, la Bizhub C3350i puede producir impresiones de alta calidad con una precisión y consistencia excepcionales. Sus avanzadas funciones de escaneado, incluida la posibilidad de escanear a correo electrónico o servidores FTP, facilitan la digitalización y el uso compartido de documentos importantes de forma eficiente. La impresora también cuenta con una interfaz fácil de usar con una gran pantalla táctil en color, lo que permite una fácil integración en los flujos de trabajo existentes. La Bizhub C3350i es ideal para imprimir una gran variedad de documentos como informes, folletos y presentaciones, por lo que es adecuada para empresas que requieren una solución de impresión fiable y eficiente. Con su diseño compacto y fácil instalación, la Konica Minolta Bizhub C3350i es una excelente opción para pequeñas y medianas empresas que buscan mejorar sus capacidades de impresión y escaneado.	100.15	Oficina	t	f	t	{}	220-240 V; menos de 1.45 kW	42 x 52.8 x 57.2 cm (sin opciones)	Legal	8.5" x 14"	Carta	t	Legal, Carta, A6-A4	Windows 7 (32/64); Windows 8/8.1 (32/64); Windows 10 (32/64); Windows Server 2008 (32/64); Windows Server 2008 R2; Windows Server 2012; Windows Server 2012 R2; Windows Server 2016; Windows Server 2019; Macintosh OS X 10.10 o posterior; Unix; Linux; Citrix	Impresión, copiado y escaneo	\N	210	33	USD
431754ed-6851-4537-bc2a-43f831bc4344	Konica Minolta	Bizhub Press 1250	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Konica_Minolta/Bizhub_Press_1250/bizhub_PRESS_1250_Specs_Sheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Konica_Minolta/Bizhub_PRO_1250/bizhub-pro-1250-front1.png}	La Konica Minolta Bizhub Press 1250 es una impresora de producción de alta velocidad diseñada para entornos de impresión profesionales. Con una velocidad de impresión de hasta 125 páginas por minuto y una resolución máxima de 1200 x 1200 DPI, la Bizhub Press 1250 puede producir impresiones de alta calidad con una precisión y consistencia excepcionales. Sus capacidades avanzadas de manejo de papel, incluyendo una bandeja de papel de gran capacidad y una gama de opciones de acabado, facilitan la impresión eficiente de trabajos de impresión complejos y diversos. La impresora también ofrece un funcionamiento sencillo con una gran pantalla táctil en color y una interfaz personalizable, lo que permite una fácil integración en los flujos de trabajo existentes. La Bizhub Press 1250 es ideal para imprimir una gran variedad de documentos como manuales, informes y folletos en grandes volúmenes, por lo que es adecuada para empresas que requieren capacidades de impresión rápidas y eficientes. Con su rendimiento y fiabilidad superiores, la Konica Minolta Bizhub Press 1250 es una excelente opción para las empresas que buscan mejorar sus capacidades de impresión y agilizar sus procesos de impresión.	100.15	Produccion	f	t	f	{}	208-240 V; 24A; 	99 x 90.9 x 123.19 cm	Tabloide	12" x 18"	Tabloide	t	A6-SRA3	Windows: Windows 7, Windows 8, Windows 8.1, Windows 10, Windows Server 2008, Windows Server 2008 R2, Windows Server 2012, Windows Server 2012 R2, Windows Server 2016, Windows Server 2019; Macintosh: Mac OS X 10.8 or later; Linux: RedHat Enterprise Linux 6.5/6.6/7.0, SUSE Linux Enterprise Desktop 11 SP3, SUSE Linux Enterprise Desktop 12	Impresión, copiado y escaneo	\N	350	125	USD
b9f8245f-5802-4cde-b648-dcf13463edeb	Epson	ColorWorks C6500AU	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Epson/ColorWorks_C6500AU/Epson_Colorworks_C6500_Datasheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Epson/ColorWorks_C6500AU/Colorworks-C6500AU-front.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Epson/ColorWorks_C6500AU/Colorworks-C6500AU-side.png}	Las nuevas impresoras de etiquetas de la serie Epson ColorWorks fueron diseñadas para ofrecer la solución ideal para el etiquetado a color y monocromático. Con su diseño compacto, panel de control fácil de navegar y su amplia variedad de impresión en diferentes tamaños de etiquetas, es una solución inteligente. Estas impresoras digitales ofrecen impresión de inyeccion de tinta con sus cuatro colores, ofreciendo nuevas oportunidades para empresas que gestionan múltiples códigos de parte y requieren etiquetas bajo demanda en muy poco tiempo. La nueva serie de Epson ColorWorks CW-C6500 amplía la gama de Epson para satisfacer las necesidades de los clientes que demandan confiabilidad y productividad en los diversos sectores de la industria.	100.15	Etiquetas	t	f	t	{}	110-240 V; 60 W	44.4 x 51.5 x 32.6 cm	8.34"	8.34"	Rollo 8.34	f	Rollo (1" - 8.5")	Windows® 10, 8.1, 8.7, 7 SP1, Vista SP2, Server, Mac® 10.6.8 o superior, Linux®	Impresión	\N	236	127	USD
012a0737-82e6-4301-b49b-162b018b1119	Epson	ColorWorks C3500	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Epson/ColorWorks_C3500/Epson_Colorworks_C3500_Datasheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Epson/ColorWorks_C3500/Colorworks-C3500-front.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Epson/ColorWorks_C3500/Colorworks-C3500-side.png}	La amplia gama de opciones y capacidad de producir todo tipo de etiquetas hacen de la impresora Epson ColorWorks TM-C3500 la solución ideal para la creciente demanda de etiquetas a color y el gran número de variaciones que han hecho que la producción sea más compleja.	100.15	Etiquetas	t	f	t	{}	110-240 V; 30 W	30.9 x 28.1 x 26.1 cm	4.25"	4.25"	Rollo 4.25	f	Rollo (1.2" - 4.25"); Continuo (2" - 4.25")	Microsoft Windows XP 32-bit (SP3)/64-bit (SP2), Vista 32-bit/64-bit(SP2), Windows 7 32-bit/64-bit (SP1), Windows 8 32-bit/64-bit	Impresión	\N	190	101	USD
9e40d872-2699-4c01-9b20-f3414b7e98c0	Epson	ColorWorks C831	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Epson/ColorWorks_C831/Epson_Colorworks_C831_Datasheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Epson/ColorWorks_C831/Colorworks-C831-front.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Epson/ColorWorks_C831/Colorworks-C831-top.png}	La Epson ColorWorks C831 es una impresora de etiquetas de inyeccion de tinta Micro Piezo ideal para tambores o depósitos de formato grande y etiquetas para productos químicos GHS.	100.15	Etiquetas	t	f	t	{}	110-240 V; 20 W	46.4 x 46.4 x 22.3 cm	8"	8"	Rollo 8	f	Formulario continuo (ancho: 76.2 - 241.3 mm, largo (una página): 12.7 - 558.8 mm, espesor: .065 - .19 mm)	Microsoft Windows XP 32-bit (SP3)/64-bit (SP2), Vista 32-bit/64-bit(SP2), Windows 7 32-bit/64-bit (SP1), Windows 8 32-bit/64-bit	Impresión	\N	190	92	USD
1a0e6e56-8500-4831-8f20-f25406c832bd	Epson	WorkForce Pro WF-6590	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Epson/WorkForce_Pro_WF-6590/Epson_WorkForce_6590_Datasheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Epson/WorkForce_Pro_WF-6590/Epson-WorkForce-Pro-WF-6590-front.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Epson/WorkForce_Pro_WF-6590/Epson-WorkForce-Pro-WF-6590-side.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Epson/WorkForce_Pro_WF-6590/Epson-WorkForce-Pro-WF-6590-panel.png}	La impresora multifuncional WorkForce Pro WF-6590, con tecnología PrecisionCore, es ideal para grupos de trabajo. Ahorra hasta un 50% en costos de impresión en comparación con las impresoras láser de color y reduce al mínimo el tiempo de inactividad gracias a los cartuchos de alta capacidad de Epson, que imprimen hasta 10000/7000 páginas en negro/color. Además, cuenta con una capacidad de papel de hasta 1580 hojas. La multifuncional de oficina WF-6590, imprime documentos de calidad profesional tan rápido como 34 ppm negro/color y es compatible con las principales soluciones de software MPS.	100.15	Oficina	t	t	t	{}	110-240 V; 39 W	51.6 x 75.6 x 54 cm	Banner	8.5" x 47.2"	Carta	t	8,9 cm x 12,7 cm, 10,2 cm x 15,2 cm, 12,5 cm x 17,8 cm, 20,3 cm x 25,4 cm, 21,6 cm x 27,9 cm, 21,6 cm x 35,6 cm, A4, A6, media carta, ejecutivo, definible por el usuario (8,9" - 119,9" de largo)	Windows 10 (32-bit, 64-bit), Windows 8.1, Windows 8 (32-bit, 64-bit), Windows 7 (32-bit, 64-bit), Windows Vista (32-bit, 64-bit), Windows® XP SP313 (32-bit), Windows® XP Professional x64 Edition, Windows Server 2016, Windows Server 2012 R2, Windows Server 2012, Windows Server 2008 R2, Windows Server 2008, Windows Server 2003 R2, Windows Server 2003, Mac OS X 10.6.x, MacOS 10.11.x9, MacOS Server	Impresión, copiado y escaneo	\N	250	24	USD
658f0101-1ced-4bab-97fb-d96a0ad9d1b9	Epson	Red WorkForce Pro WF-C869R	https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/datasheets/Epson/Red_WorkForce_Pro_WF-C869R/Epson_WorkForce_C869R_Datasheet.pdf	{https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Epson/Red_WorkForce_Pro_WF-C869R/Epson-Red-WorkForce-Pro-WF-C869R-front.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Epson/Red_WorkForce_Pro_WF-C869R/Epson-Red-WorkForce-Pro-WF-C869R-full-front.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Epson/Red_WorkForce_Pro_WF-C869R/Epson-Red-WorkForce-Pro-WF-C869R-full-side.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Epson/Red_WorkForce_Pro_WF-C869R/Epson-Red-WorkForce-Pro-WF-C869R-side.png,https://fixsell-website-images.s3.amazonaws.com/Multifuncionales/imagenes/Epson/Red_WorkForce_Pro_WF-C869R/Epson-Red-WorkForce-Pro-WF-C869R-front.png}	La impresora multifuncional WorkForce Pro WF-C869R, ideal para grupos de trabajo que desean aumentar su productividad, ofrece impresión a color a muy bajo costo. Su sistema de bolsas de tinta reemplazables rinde hasta 86000 páginas sin cambiar la tinta, lo que significa menos intervenciones y menos molestias. Acelera las impresiónes de calidad profesional hasta 35ppm negro/color  y escanea documentos hasta 25 paginas por minuto. Con impresiónes de 33 x 48 cm (13 "x 19"), una capacidad de papel total de 1835 hojas e impresión dúplex automática, la WF-C869R tiene la versatilidad que los grupos de trabajo necesitan. Además, la plataforma abierta de Epson, permite la integración perfecta con aplicaciones empresariales basadas en la Web, como PaperCut MF entre otras.	100.15	Oficina	t	t	f	{}	110-240 V; 40 W	78.7 x 86.6 x 69.9 cm	Banner	13" x 47"	Tabloide Plus	t	8,9 x 12,7 cm, 10,2 x 15,2 cm, 12,5 x 17,8 cm, 20,3 x 25,4 cm, 21,6 x 27,9 cm, 21,6 x 35,6 cm, A3, A4, A5, A6, B4, B5, media carta, ejecutivo, 27,9 x 43,2 cm, 33,0 x 48,3 cm, denible por el usuario (8,9” - 119,9” de largo)	Windows 10 (32-bit, 64-bit), Windows 8.1, Windows 8 (32-bit, 64-bit), Windows 7 (32-bit, 64-bit), Windows Vista (32-bit, 64-bit), Windows® XP SP313 (32-bit), Windows® XP Professional x64 Edition, Windows Server 2016, Windows Server 2012 R2, Windows Server 2012, Windows Server 2008 R2, Windows Server 2008, Windows Server 2003 R2, Windows Server 2003, Mac OS X 10.6.8 y MacOS 10.12.x	Impresión, copiado y escaneo	\N	250	24	USD
\.


--
-- Data for Name: printer_consumibles_consumible; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.printer_consumibles_consumible ("printerId", "consumibleId") FROM stdin;
431754ed-6851-4537-bc2a-43f831bc4344	6cd036da-6dc9-4dd2-b5e1-4af95f936409
78c61b46-4fab-489a-a2fa-cb9e10432907	4dce37da-3f7c-4db3-bed4-40a6dcf113ea
0993d7de-ee0e-42c6-b567-46bfb013e40e	7e63bf61-12e9-47ae-afd4-ab6bc2fbb9a5
\.


--
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product (id, name, buyable, sellable, product_image, product_type, product_price, product_value, product_intern_id, product_barcode, product_sticker) FROM stdin;
\.


--
-- Data for Name: product_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_category (id, category_name, withdrawal_strategy, "parentCategoryId") FROM stdin;
\.


--
-- Data for Name: product_operations_logistic; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_operations_logistic (id, routes, product_responsable, product_weight, product_volume, product_delivery_time, "productId") FROM stdin;
\.


--
-- Data for Name: product_product_categories_product_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_product_categories_product_category ("productId", "productCategoryId") FROM stdin;
\.


--
-- Data for Name: reception; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reception (id, receive_from, operation_type, expected_date, document_origin, responsible, notes, status) FROM stdin;
\.


--
-- Data for Name: reception_products_product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reception_products_product ("receptionId", "productId") FROM stdin;
\.


--
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role (id, name) FROM stdin;
75739a16-663b-4fa1-b94f-4dec20eec70f	Admin
5e7292a5-e7b3-42ae-93df-1fdc272cce50	user
26f64e15-fbb7-4a1e-84b6-45a302502d4d	admin
22dc56bd-6188-472a-a83c-fd75ddda2418	vendor
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, email, name, password, "isActive") FROM stdin;
7fd23836-ff08-416c-936d-c058600b269a	test@gmail.com	Jonas Clausen	$2a$10$4WpRuERhpS2oikPecO/NiuADaaSer/M749VdcmnHlzB3DUrDErsmC	t
01980721-0e09-48a6-b83c-ed607ff49c6a	jonastclausen@gmail.com	Jonas Clausen	$2a$10$wVOk0kj4ZvKRP1zUR5Z2seoz9n53BsTnQEfWG.8F/LLAufPm5ijHe	t
\.


--
-- Data for Name: user_roles_role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_roles_role ("userId", "roleId") FROM stdin;
7fd23836-ff08-416c-936d-c058600b269a	5e7292a5-e7b3-42ae-93df-1fdc272cce50
7fd23836-ff08-416c-936d-c058600b269a	26f64e15-fbb7-4a1e-84b6-45a302502d4d
01980721-0e09-48a6-b83c-ed607ff49c6a	5e7292a5-e7b3-42ae-93df-1fdc272cce50
01980721-0e09-48a6-b83c-ed607ff49c6a	26f64e15-fbb7-4a1e-84b6-45a302502d4d
\.


--
-- Name: brand_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.brand_id_seq', 22, true);


--
-- Name: category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.category_id_seq', 32, true);


--
-- Name: deal_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.deal_id_seq', 13, true);


--
-- Name: package_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.package_id_seq', 25, true);


--
-- Name: product_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_category_id_seq', 1, false);


--
-- Name: product_operations_logistic_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_operations_logistic_id_seq', 1, false);


--
-- Name: reception_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reception_id_seq', 1, false);


--
-- Name: order_detail PK_0afbab1fa98e2fb0be8e74f6b38; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_detail
    ADD CONSTRAINT "PK_0afbab1fa98e2fb0be8e74f6b38" PRIMARY KEY (id);


--
-- Name: product_category PK_0dce9bc93c2d2c399982d04bef1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_category
    ADD CONSTRAINT "PK_0dce9bc93c2d2c399982d04bef1" PRIMARY KEY (id);


--
-- Name: order PK_1031171c13130102495201e3e20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY (id);


--
-- Name: consumible_printers_printer PK_231579c1e1ee6f6e9d3d0cd702f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consumible_printers_printer
    ADD CONSTRAINT "PK_231579c1e1ee6f6e9d3d0cd702f" PRIMARY KEY ("consumibleId", "printerId");


--
-- Name: package PK_308364c66df656295bc4ec467c2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.package
    ADD CONSTRAINT "PK_308364c66df656295bc4ec467c2" PRIMARY KEY (id);


--
-- Name: consumible PK_3b1c490333b1ba1c5f5325de6c0; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consumible
    ADD CONSTRAINT "PK_3b1c490333b1ba1c5f5325de6c0" PRIMARY KEY (id);


--
-- Name: product_product_categories_product_category PK_5674b9e204dc5896a36c2baefa9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_product_categories_product_category
    ADD CONSTRAINT "PK_5674b9e204dc5896a36c2baefa9" PRIMARY KEY ("productId", "productCategoryId");


--
-- Name: printer_consumibles_consumible PK_66b855cdc3deeae94a90e6f72d4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.printer_consumibles_consumible
    ADD CONSTRAINT "PK_66b855cdc3deeae94a90e6f72d4" PRIMARY KEY ("printerId", "consumibleId");


--
-- Name: reception PK_68005a51f6e37ca7a0e5c305471; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reception
    ADD CONSTRAINT "PK_68005a51f6e37ca7a0e5c305471" PRIMARY KEY (id);


--
-- Name: reception_products_product PK_70b6fdb32ff373f7982a54e4421; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reception_products_product
    ADD CONSTRAINT "PK_70b6fdb32ff373f7982a54e4421" PRIMARY KEY ("receptionId", "productId");


--
-- Name: product_operations_logistic PK_762d280d9e6e7004f28346a2ece; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_operations_logistic
    ADD CONSTRAINT "PK_762d280d9e6e7004f28346a2ece" PRIMARY KEY (id);


--
-- Name: category PK_9c4e4a89e3674fc9f382d733f03; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY (id);


--
-- Name: deal PK_9ce1c24acace60f6d7dc7a7189e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.deal
    ADD CONSTRAINT "PK_9ce1c24acace60f6d7dc7a7189e" PRIMARY KEY (id);


--
-- Name: printer PK_a07d4f7686a51f38ae237def52b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.printer
    ADD CONSTRAINT "PK_a07d4f7686a51f38ae237def52b" PRIMARY KEY (id);


--
-- Name: brand PK_a5d20765ddd942eb5de4eee2d7f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brand
    ADD CONSTRAINT "PK_a5d20765ddd942eb5de4eee2d7f" PRIMARY KEY (id);


--
-- Name: role PK_b36bcfe02fc8de3c57a8b2391c2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY (id);


--
-- Name: user_roles_role PK_b47cd6c84ee205ac5a713718292; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles_role
    ADD CONSTRAINT "PK_b47cd6c84ee205ac5a713718292" PRIMARY KEY ("userId", "roleId");


--
-- Name: product PK_bebc9158e480b949565b4dc7a82; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY (id);


--
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- Name: product_operations_logistic REL_75e12a5766f780a2081708755a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_operations_logistic
    ADD CONSTRAINT "REL_75e12a5766f780a2081708755a" UNIQUE ("productId");


--
-- Name: category UQ_23c05c292c439d77b0de816b500; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT "UQ_23c05c292c439d77b0de816b500" UNIQUE (name);


--
-- Name: brand UQ_5f468ae5696f07da025138e38f7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brand
    ADD CONSTRAINT "UQ_5f468ae5696f07da025138e38f7" UNIQUE (name);


--
-- Name: role UQ_ae4578dcaed5adff96595e61660; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE (name);


--
-- Name: printer UQ_cd58c40a4de2a9b985b76e83e1f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.printer
    ADD CONSTRAINT "UQ_cd58c40a4de2a9b985b76e83e1f" UNIQUE (model);


--
-- Name: user UQ_e12875dfb3b1d92d7d7c5377e22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE (email);


--
-- Name: IDX_01dd4b5e3aaeee416a956b5937; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_01dd4b5e3aaeee416a956b5937" ON public.consumible_printers_printer USING btree ("consumibleId");


--
-- Name: IDX_44ec1355f198437d626040d3f4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_44ec1355f198437d626040d3f4" ON public.product_product_categories_product_category USING btree ("productCategoryId");


--
-- Name: IDX_46ebbd32b336ed916cb6f3b92b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_46ebbd32b336ed916cb6f3b92b" ON public.reception_products_product USING btree ("productId");


--
-- Name: IDX_4be2f7adf862634f5f803d246b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_4be2f7adf862634f5f803d246b" ON public.user_roles_role USING btree ("roleId");


--
-- Name: IDX_4f5282413284f4b9b5787cc1a3; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_4f5282413284f4b9b5787cc1a3" ON public.reception_products_product USING btree ("receptionId");


--
-- Name: IDX_56d8ca73c2cbb10a61a8045cfe; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_56d8ca73c2cbb10a61a8045cfe" ON public.consumible_printers_printer USING btree ("printerId");


--
-- Name: IDX_5f9286e6c25594c6b88c108db7; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_5f9286e6c25594c6b88c108db7" ON public.user_roles_role USING btree ("userId");


--
-- Name: IDX_6fb767ca0790be75b3d4365421; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_6fb767ca0790be75b3d4365421" ON public.printer_consumibles_consumible USING btree ("consumibleId");


--
-- Name: IDX_d5ba99d1873a5b4f332f64c000; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_d5ba99d1873a5b4f332f64c000" ON public.product_product_categories_product_category USING btree ("productId");


--
-- Name: IDX_ea1a72f060e722d396933e32da; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_ea1a72f060e722d396933e32da" ON public.printer_consumibles_consumible USING btree ("printerId");


--
-- Name: consumible_printers_printer FK_01dd4b5e3aaeee416a956b59371; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consumible_printers_printer
    ADD CONSTRAINT "FK_01dd4b5e3aaeee416a956b59371" FOREIGN KEY ("consumibleId") REFERENCES public.consumible(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: deal FK_104dd4e4e6af157bb1ab29076be; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.deal
    ADD CONSTRAINT "FK_104dd4e4e6af157bb1ab29076be" FOREIGN KEY ("consumibleId") REFERENCES public.consumible(id) ON DELETE CASCADE;


--
-- Name: deal FK_107574686fd9a0463b9dfae9ffb; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.deal
    ADD CONSTRAINT "FK_107574686fd9a0463b9dfae9ffb" FOREIGN KEY ("printerId") REFERENCES public.printer(id) ON DELETE CASCADE;


--
-- Name: consumible FK_2a465ab5421304f86570e1a539e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consumible
    ADD CONSTRAINT "FK_2a465ab5421304f86570e1a539e" FOREIGN KEY ("counterpartId") REFERENCES public.consumible(id);


--
-- Name: package FK_424ad2336e30b7c04efa5412b96; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.package
    ADD CONSTRAINT "FK_424ad2336e30b7c04efa5412b96" FOREIGN KEY ("printerId") REFERENCES public.printer(id);


--
-- Name: product_product_categories_product_category FK_44ec1355f198437d626040d3f4c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_product_categories_product_category
    ADD CONSTRAINT "FK_44ec1355f198437d626040d3f4c" FOREIGN KEY ("productCategoryId") REFERENCES public.product_category(id);


--
-- Name: reception_products_product FK_46ebbd32b336ed916cb6f3b92b4; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reception_products_product
    ADD CONSTRAINT "FK_46ebbd32b336ed916cb6f3b92b4" FOREIGN KEY ("productId") REFERENCES public.product(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_roles_role FK_4be2f7adf862634f5f803d246b8; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles_role
    ADD CONSTRAINT "FK_4be2f7adf862634f5f803d246b8" FOREIGN KEY ("roleId") REFERENCES public.role(id);


--
-- Name: reception_products_product FK_4f5282413284f4b9b5787cc1a30; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reception_products_product
    ADD CONSTRAINT "FK_4f5282413284f4b9b5787cc1a30" FOREIGN KEY ("receptionId") REFERENCES public.reception(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: consumible_printers_printer FK_56d8ca73c2cbb10a61a8045cfe1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consumible_printers_printer
    ADD CONSTRAINT "FK_56d8ca73c2cbb10a61a8045cfe1" FOREIGN KEY ("printerId") REFERENCES public.printer(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_roles_role FK_5f9286e6c25594c6b88c108db77; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles_role
    ADD CONSTRAINT "FK_5f9286e6c25594c6b88c108db77" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: printer_consumibles_consumible FK_6fb767ca0790be75b3d4365421c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.printer_consumibles_consumible
    ADD CONSTRAINT "FK_6fb767ca0790be75b3d4365421c" FOREIGN KEY ("consumibleId") REFERENCES public.consumible(id);


--
-- Name: product_operations_logistic FK_75e12a5766f780a2081708755ac; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_operations_logistic
    ADD CONSTRAINT "FK_75e12a5766f780a2081708755ac" FOREIGN KEY ("productId") REFERENCES public.product(id) ON DELETE CASCADE;


--
-- Name: order_detail FK_88850b85b38a8a2ded17a1f5369; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_detail
    ADD CONSTRAINT "FK_88850b85b38a8a2ded17a1f5369" FOREIGN KEY ("orderId") REFERENCES public."order"(id);


--
-- Name: order_detail FK_940b33729a30f3104d7faddf218; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_detail
    ADD CONSTRAINT "FK_940b33729a30f3104d7faddf218" FOREIGN KEY ("consumibleId") REFERENCES public.consumible(id);


--
-- Name: product_category FK_a38ad62c794b2585da78c423e85; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_category
    ADD CONSTRAINT "FK_a38ad62c794b2585da78c423e85" FOREIGN KEY ("parentCategoryId") REFERENCES public.product_category(id);


--
-- Name: product_product_categories_product_category FK_d5ba99d1873a5b4f332f64c0007; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_product_categories_product_category
    ADD CONSTRAINT "FK_d5ba99d1873a5b4f332f64c0007" FOREIGN KEY ("productId") REFERENCES public.product(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: printer_consumibles_consumible FK_ea1a72f060e722d396933e32da6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.printer_consumibles_consumible
    ADD CONSTRAINT "FK_ea1a72f060e722d396933e32da6" FOREIGN KEY ("printerId") REFERENCES public.printer(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

--
-- Database "postgres" dump
--

\connect postgres

--
-- PostgreSQL database dump
--

-- Dumped from database version 14.3 (Debian 14.3-1.pgdg110+1)
-- Dumped by pg_dump version 14.3 (Debian 14.3-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database cluster dump complete
--

