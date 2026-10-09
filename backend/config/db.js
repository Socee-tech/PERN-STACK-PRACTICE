import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();

const { PGUSER, PGPASSWORD, PGHOST, PGDATABASE } = process.env;

// This creates our SQL connection using environment variables. The connection string is in the format:
// postgresql://<user>:<password>@<host>/<database>?sslmode=require&channel_binding=require
export const sql = neon(
    `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require&channel_binding=require`
);

// Tis SQL function we export is used as a tagged template litteral, which allows us to write SQL querries safely and easily. It will automatically handle escaping values and prevent SQL injection attacks.

// postgresql://neondb_owner:npg_9Of4CEplZVYd@ep-lively-voice-b4iy84ow-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require

