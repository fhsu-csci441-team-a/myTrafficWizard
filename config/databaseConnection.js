const { Pool } = require('pg');

/**
 * DatabaseConnection manages a PostgreSQL connection pool, automatically closing the pool 
 * after a specified period of inactivity to free up resources.
 * 
 * Example usage:
 * 
 * // Initialize the database connection with a connection string and optional auto-close delay.
 * const db = new DatabaseConnection('postgresql://user:password@localhost/dbname', 60000);
 * 
 * // Use the query method to execute SQL queries.
 * db.query('SELECT * FROM scheduled_trips WHERE id = $1', [1])
 *   .then(rows => console.log(rows))
 *   .catch(err => console.error('The following error occurred:', err));
 * 
 * // Close the connection pool manually when it's no longer needed.
 * db.close().then(() => console.log('Connection pool closed'));
 * 
 */
class DatabaseConnection {
    #pool;
    #connectionString;
    #autoCloseTimeout; // Timeout reference for auto-closing the pool.
    #autoCloseDelay = 1800000; // Delay before automatically closing the pool due to inactivity.


    /**
    * Initializes the database connection pool.
    * @param {string} connectionString - The connection string for PostgreSQL.
    * @param {number} autoCloseDelay - The delay (in milliseconds) before auto-closing the pool.
    */
    constructor(connectionString, autoCloseDelay = 1800000) {
        this.#connectionString = connectionString;
        this.#autoCloseDelay = autoCloseDelay;
        this.#initializePool();
    }

    #initializePool() {
        this.#pool = new Pool({ connectionString: this.#connectionString });
        this.#resetAutoClose();
    }

    /**
     * Resets the auto-close timer to delay closing the pool due to inactivity.
     */
    #resetAutoClose() {
        clearTimeout(this.#autoCloseTimeout);
        this.#autoCloseTimeout = setTimeout(async () => {
            await this.close();
        }, this.#autoCloseDelay);
    }


    /**
    * Resets the pool to ensure it's no longer usable after closing.
    */
    #resetPool() {
        this.#pool = null;
    }

    /**
     * Executes a SQL query against the database.
     * @param {string} sql - The SQL query string.
     * @param {Array} params - The parameters for the SQL query.
     * @returns {Promise<Array>} The rows returned by the query.
     */
    async query(sql, params) {

        this.#resetAutoClose();

        const res = await this.#pool.query(sql, params);
        return res.rows;
    }

    /**
     * Closes the database connection pool and clears any resources.
     */
    async close() {
        if (!this.#pool) return;

        console.log("Closing database connection pool...");
        await this.#pool.end();
        clearTimeout(this.#autoCloseTimeout);
        this.#resetPool();
        console.log("Database connection pool has been closed.");
    }
}

module.exports = DatabaseConnection;
