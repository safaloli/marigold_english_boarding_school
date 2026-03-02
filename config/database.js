require('dotenv').config()
const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME ,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL database');
    console.log("ENV DB_NAME:", process.env.DB_NAME);
    const [rows] = await pool.query("SELECT DATABASE() as db");
console.log("ACTUAL DATABASE IN USE:", rows[0].db);
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Graceful shutdown
const disconnect = async () => {
  try {
    await pool.end();
    console.log('✅ Disconnected from database');
  } catch (error) {
    console.error('❌ Error disconnecting from database:', error.message);
  }
};

// Helper function to convert camelCase to snake_case
const toSnakeCase = (str) => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

// Helper function to convert snake_case to camelCase
const toCamelCase = (str) => {
  return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
};

// Convert object keys from snake_case to camelCase
const rowToCamel = (row) => {
  if (!row) return null;
  const camelRow = {};
  for (const key in row) {
    camelRow[toCamelCase(key)] = row[key];
  }
  return camelRow;
};

// Convert array of rows from snake_case to camelCase
const rowsToCamel = (rows) => {
  return rows.map(row => rowToCamel(row));
};

// Database operations object
const db = {
  // Raw query method
  query: async (sql, params = []) => {
    const [rows] = await pool.execute(sql, params);
    return rows;
  },

  // User operations
  users: {
    async create(userData) {
      const id = uuidv4();
      const sql = `
        INSERT INTO users (id, first_name, last_name, email, password, role, is_active, profile_image, phone, address, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
      await pool.execute(sql, [
        id,
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.password,
        userData.role || 'USER',
        userData.isActive !== undefined ? userData.isActive : true,
        userData.profileImage || null,
        userData.phone || null,
        userData.address || null,
      ]);
      return this.findById(id);
    },

    async findByEmail(email) {
      const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
      return rowToCamel(rows[0]);
    },

    async findById(id) {
      const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
      return rowToCamel(rows[0]);
    },

    async update(id, updates) {
      const fields = [];
      const values = [];

      for (const [key, value] of Object.entries(updates)) {
        // Skip undefined values
        if (value === undefined) continue;

        fields.push(`${toSnakeCase(key)} = ?`);
        values.push(value);
      }

      // If no fields to update, return existing record
      if (fields.length === 0) {
        return this.findById(id);
      }

      values.push(id);
      const sql = `UPDATE users SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`;
      await pool.execute(sql, values);
      return this.findById(id);
    },

    async delete(id) {
      await pool.execute('DELETE FROM users WHERE id = ?', [id]);
      return { id };
    },

    async findAll(options = {}) {
      const { limit, offset, role, isActive } = options;
      let sql = 'SELECT * FROM users WHERE 1=1';
      const params = [];

      if (role) {
        sql += ' AND role = ?';
        params.push(role);
      }

      if (isActive !== undefined) {
        sql += ' AND is_active = ?';
        params.push(isActive);
      }

      sql += ' ORDER BY created_at DESC';

      if (limit) {
        sql += ' LIMIT ?';
        params.push(limit);
      }

      if (offset) {
        sql += ' OFFSET ?';
        params.push(offset);
      }

      const [rows] = await pool.execute(sql, params);
      return rowsToCamel(rows);
    }
  },

  // Homepage content operations
  homepageContent: {
    async create(contentData) {
      const id = uuidv4();
      const sql = `
        INSERT INTO homepage_content 
        (id, section, \`key\`, title, content, description, image_url, link_url, order_index, is_active, metadata, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `;
      await pool.execute(sql, [
        id,
        contentData.section,
        contentData.key,
        contentData.title || null,
        contentData.content || null,
        contentData.description || null,
        contentData.imageUrl || null,
        contentData.linkUrl || null,
        contentData.orderIndex || null,
        contentData.isActive !== undefined ? contentData.isActive : true,
        contentData.metadata || null,
      ]);
      return this.findById(id);
    },

    async findAll(options = {}) {
      const { section, isActive } = options;
      let sql = 'SELECT * FROM homepage_content WHERE 1=1';
      const params = [];

      if (section) {
        sql += ' AND section = ?';
        params.push(section);
      }

      if (isActive !== undefined) {
        sql += ' AND is_active = ?';
        params.push(isActive);
      }

      sql += ' ORDER BY order_index ASC';

      const [rows] = await pool.execute(sql, params);
      return rowsToCamel(rows);
    },

    async findBySection(section) {
      const [rows] = await pool.execute(
        'SELECT * FROM homepage_content WHERE section = ? AND is_active = 1 ORDER BY order_index ASC',
        [section]
      );
      return rowsToCamel(rows);
    },

    async findById(id) {
      const [rows] = await pool.execute('SELECT * FROM homepage_content WHERE id = ?', [id]);
      return rowToCamel(rows[0]);
    },

    async findBySectionAndKey(section, key) {
      const [rows] = await pool.execute(
        'SELECT * FROM homepage_content WHERE section = ? AND `key` = ?',
        [section, key]
      );
      return rowToCamel(rows[0]);
    },

    async update(id, updates) {
      const fields = [];
      const values = [];

      for (const [key, value] of Object.entries(updates)) {
        // Skip undefined values
        if (value === undefined) continue;

        const snakeKey = toSnakeCase(key);
        fields.push(`${snakeKey === 'key' ? '`key`' : snakeKey} = ?`);
        values.push(value);
      }

      // If no fields to update, return existing record
      if (fields.length === 0) {
        return this.findById(id);
      }

      values.push(id);
      const sql = `UPDATE homepage_content SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`;
      await pool.execute(sql, values);
      return this.findById(id);
    },

    async updateBySectionAndKey(section, key, updates) {
      const existing = await this.findBySectionAndKey(section, key);
      if (existing) {
        return this.update(existing.id, updates);
      }
      return null;
    },

    async upsertBySectionAndKey(section, key, data) {
      const existing = await this.findBySectionAndKey(section, key);

      if (existing) {
        return this.update(existing.id, data);
      } else {
        return this.create({ section, key, ...data });
      }
    },

    async updateMany(where, data) {
      const fields = [];
      const values = [];

      for (const [key, value] of Object.entries(data)) {
        fields.push(`${toSnakeCase(key)} = ?`);
        values.push(value);
      }

      const whereFields = [];
      for (const [key, value] of Object.entries(where)) {
        whereFields.push(`${toSnakeCase(key)} = ?`);
        values.push(value);
      }

      const sql = `UPDATE homepage_content SET ${fields.join(', ')}, updated_at = NOW() WHERE ${whereFields.join(' AND ')}`;
      const [result] = await pool.execute(sql, values);
      return { count: result.affectedRows };
    },

    async delete(id) {
      await pool.execute('DELETE FROM homepage_content WHERE id = ?', [id]);
      return { id };
    },

    async deleteBySectionAndKey(section, key) {
      await pool.execute('DELETE FROM homepage_content WHERE section = ? AND `key` = ?', [section, key]);
      return { section, key };
    }
  },

  // Academics content operations
  academicsContent: {
    async create(contentData) {
      const id = uuidv4();
      const sql = `
        INSERT INTO academics_content 
        (id, section, \`key\`, title, content, description, image_url, link_url, order_index, is_active, metadata, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `;
      await pool.execute(sql, [
        id,
        contentData.section,
        contentData.key,
        contentData.title || null,
        contentData.content || null,
        contentData.description || null,
        contentData.imageUrl || null,
        contentData.linkUrl || null,
        contentData.orderIndex || null,
        contentData.isActive !== undefined ? contentData.isActive : true,
        contentData.metadata || null,
      ]);
      return this.findById(id);
    },

    async findAll(options = {}) {
      const { section, isActive = true } = options;
      let sql = 'SELECT * FROM academics_content WHERE 1=1';
      const params = [];

      if (section) {
        sql += ' AND section = ?';
        params.push(section);
      }

      if (isActive !== undefined) {
        sql += ' AND is_active = ?';
        params.push(isActive);
      }

      sql += ' ORDER BY section ASC, order_index ASC, updated_at ASC';

      const [rows] = await pool.execute(sql, params);
      return rowsToCamel(rows);
    },

    async findBySection(section) {
      const [rows] = await pool.execute(
        'SELECT * FROM academics_content WHERE section = ? AND is_active = 1 ORDER BY order_index ASC, updated_at ASC',
        [section]
      );
      return rowsToCamel(rows);
    },

    async findById(id) {
      const [rows] = await pool.execute('SELECT * FROM academics_content WHERE id = ?', [id]);
      return rowToCamel(rows[0]);
    },

    async findBySectionAndKey(section, key) {
      const [rows] = await pool.execute(
        'SELECT * FROM academics_content WHERE section = ? AND `key` = ?',
        [section, key]
      );
      return rowToCamel(rows[0]);
    },

    async update(id, updates) {
      const fields = [];
      const values = [];

      for (const [key, value] of Object.entries(updates)) {
        // Skip undefined values
        if (value === undefined) continue;

        const snakeKey = toSnakeCase(key);
        fields.push(`${snakeKey === 'key' ? '`key`' : snakeKey} = ?`);
        values.push(value);
      }

      // If no fields to update, return existing record
      if (fields.length === 0) {
        return this.findById(id);
      }

      values.push(id);
      const sql = `UPDATE academics_content SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`;
      await pool.execute(sql, values);
      return this.findById(id);
    },

    async updateBySectionAndKey(section, key, updates) {
      const existing = await this.findBySectionAndKey(section, key);
      if (existing) {
        return this.update(existing.id, updates);
      }
      return null;
    },

    async upsertBySectionAndKey(section, key, data) {
      const existing = await this.findBySectionAndKey(section, key);

      if (existing) {
        return this.update(existing.id, data);
      } else {
        return this.create({ section, key, ...data });
      }
    },

    async updateMany(where, data) {
      const fields = [];
      const values = [];

      for (const [key, value] of Object.entries(data)) {
        fields.push(`${toSnakeCase(key)} = ?`);
        values.push(value);
      }

      const whereFields = [];
      for (const [key, value] of Object.entries(where)) {
        whereFields.push(`${toSnakeCase(key)} = ?`);
        values.push(value);
      }

      const sql = `UPDATE academics_content SET ${fields.join(', ')}, updated_at = NOW() WHERE ${whereFields.join(' AND ')}`;
      const [result] = await pool.execute(sql, values);
      return { count: result.affectedRows };
    },

    async delete(id) {
      await pool.execute('DELETE FROM academics_content WHERE id = ?', [id]);
      return { id };
    },

    async deleteBySectionAndKey(section, key) {
      const existing = await this.findBySectionAndKey(section, key);
      if (existing) {
        return this.delete(existing.id);
      }
      return null;
    }
  },

  // Contact content operations
  contactContent: {
    async create(contentData) {
      const id = uuidv4();
      const sql = `
        INSERT INTO contact_content 
        (id, section, \`key\`, title, content, description, image_url, link_url, order_index, is_active, metadata, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `;
      await pool.execute(sql, [
        id,
        contentData.section,
        contentData.key,
        contentData.title || null,
        contentData.content || null,
        contentData.description || null,
        contentData.imageUrl || null,
        contentData.linkUrl || null,
        contentData.orderIndex || null,
        contentData.isActive !== undefined ? contentData.isActive : true,
        contentData.metadata || null,
      ]);
      return this.findById(id);
    },

    async findAll(options = {}) {
      const { section, isActive = true } = options;
      let sql = 'SELECT * FROM contact_content WHERE 1=1';
      const params = [];

      if (section) {
        sql += ' AND section = ?';
        params.push(section);
      }

      if (isActive !== undefined) {
        sql += ' AND is_active = ?';
        params.push(isActive);
      }

      sql += ' ORDER BY section ASC, order_index ASC, updated_at ASC';

      const [rows] = await pool.execute(sql, params);
      return rowsToCamel(rows);
    },

    // Alias for compatibility
    async findMany(options = {}) {
      return this.findAll(options);
    },

    async findBySection(section) {
      const [rows] = await pool.execute(
        'SELECT * FROM contact_content WHERE section = ? AND is_active = 1 ORDER BY order_index ASC, updated_at ASC',
        [section]
      );
      return rowsToCamel(rows);
    },

    async findById(id) {
      const [rows] = await pool.execute('SELECT * FROM contact_content WHERE id = ?', [id]);
      return rowToCamel(rows[0]);
    },

    async findBySectionAndKey(section, key) {
      const [rows] = await pool.execute(
        'SELECT * FROM contact_content WHERE section = ? AND `key` = ?',
        [section, key]
      );
      return rowToCamel(rows[0]);
    },

    async update(id, updates) {
      const fields = [];
      const values = [];

      for (const [key, value] of Object.entries(updates)) {
        // Skip undefined values
        if (value === undefined) continue;

        const snakeKey = toSnakeCase(key);
        fields.push(`${snakeKey === 'key' ? '`key`' : snakeKey} = ?`);
        values.push(value);
      }

      // If no fields to update, return existing record
      if (fields.length === 0) {
        return this.findById(id);
      }

      values.push(id);
      const sql = `UPDATE contact_content SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`;
      await pool.execute(sql, values);
      return this.findById(id);
    },

    async updateBySectionAndKey(section, key, updates) {
      const existing = await this.findBySectionAndKey(section, key);
      if (existing) {
        return this.update(existing.id, updates);
      }
      return null;
    },

    async upsertBySectionAndKey(section, key, data) {
      const existing = await this.findBySectionAndKey(section, key);

      if (existing) {
        return this.update(existing.id, data);
      } else {
        return this.create({ section, key, ...data });
      }
    },

    async updateMany(where, data) {
      const fields = [];
      const values = [];

      for (const [key, value] of Object.entries(data)) {
        fields.push(`${toSnakeCase(key)} = ?`);
        values.push(value);
      }

      const whereFields = [];
      for (const [key, value] of Object.entries(where)) {
        whereFields.push(`${toSnakeCase(key)} = ?`);
        values.push(value);
      }

      const sql = `UPDATE contact_content SET ${fields.join(', ')}, updated_at = NOW() WHERE ${whereFields.join(' AND ')}`;
      const [result] = await pool.execute(sql, values);
      return { count: result.affectedRows };
    },

    async delete(id) {
      await pool.execute('DELETE FROM contact_content WHERE id = ?', [id]);
      return { id };
    },

    async deleteBySectionAndKey(section, key) {
      const existing = await this.findBySectionAndKey(section, key);
      if (existing) {
        return this.delete(existing.id);
      }
      return null;
    },

    async deleteMany(where) {
      const whereFields = [];
      const values = [];
      for (const [key, value] of Object.entries(where)) {
        whereFields.push(`${toSnakeCase(key)} = ?`);
        values.push(value);
      }
      const sql = `DELETE FROM contact_content WHERE ${whereFields.join(' AND ')}`;
      const [result] = await pool.execute(sql, values);
      return { count: result.affectedRows };
    }
  },

  // Events content operations
  eventsContent: {
    async create(contentData) {
      const id = uuidv4();
      const sql = `
        INSERT INTO events_content 
        (id, section, \`key\`, title, content, description, image_url, link_url, category, event_date, icon, badge, 
         order_index, is_active, metadata, event_time, venue, organizer, contact_info, event_schedule, guests, 
         registration_enabled, location_map, help_desk, pdf_files, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `;
      await pool.execute(sql, [
        id,
        contentData.section,
        contentData.key,
        contentData.title || null,
        contentData.content || null,
        contentData.description || null,
        contentData.imageUrl || null,
        contentData.linkUrl || null,
        contentData.category || null,
        contentData.eventDate || null,
        contentData.icon || null,
        contentData.badge || null,
        contentData.orderIndex || null,
        contentData.isActive !== undefined ? contentData.isActive : true,
        contentData.metadata || null,
        contentData.eventTime || null,
        contentData.venue || null,
        contentData.organizer || null,
        contentData.contactInfo || null,
        contentData.eventSchedule || null,
        contentData.guests || null,
        contentData.registrationEnabled || false,
        contentData.locationMap || null,
        contentData.helpDesk || null,
        contentData.pdfFiles || null,
      ]);
      return this.findById(id);
    },

    async findAll(options = {}) {
      const { section, isActive = true } = options;
      let sql = 'SELECT * FROM events_content WHERE 1=1';
      const params = [];

      if (section) {
        sql += ' AND section = ?';
        params.push(section);
      }

      if (isActive !== undefined) {
        sql += ' AND is_active = ?';
        params.push(isActive);
      }

      sql += ' ORDER BY section ASC, order_index ASC, updated_at ASC';

      const [rows] = await pool.execute(sql, params);
      return rowsToCamel(rows);
    },

    async findMany(options = {}) {
      const { where, orderBy, take, skip } = options;
      let sql = 'SELECT * FROM events_content WHERE 1=1';
      const params = [];

      if (where) {
        for (const [key, value] of Object.entries(where)) {
          sql += ` AND ${toSnakeCase(key)} = ?`;
          params.push(value);
        }
      }

      if (orderBy) {
        const orderFields = [];
        for (const [key, dir] of Object.entries(orderBy)) {
          orderFields.push(`${toSnakeCase(key)} ${dir.toUpperCase()}`);
        }
        sql += ` ORDER BY ${orderFields.join(', ')}`;
      } else {
        sql += ' ORDER BY section ASC, order_index ASC, updated_at ASC';
      }

      if (take) {
        sql += ' LIMIT ?';
        params.push(take);
      }

      if (skip) {
        sql += ' OFFSET ?';
        params.push(skip);
      }

      const [rows] = await pool.execute(sql, params);
      return rowsToCamel(rows);
    },

    async findBySection(section) {
      const [rows] = await pool.execute(
        'SELECT * FROM events_content WHERE section = ? AND is_active = 1 ORDER BY order_index ASC, updated_at ASC',
        [section]
      );
      return rowsToCamel(rows);
    },

    async findById(id) {
      const [rows] = await pool.execute('SELECT * FROM events_content WHERE id = ?', [id]);
      return rowToCamel(rows[0]);
    },

    async findBySectionAndKey(section, key) {
      const [rows] = await pool.execute(
        'SELECT * FROM events_content WHERE section = ? AND `key` = ?',
        [section, key]
      );
      return rowToCamel(rows[0]);
    },

    async update(id, updates) {
      const fields = [];
      const values = [];

      for (const [key, value] of Object.entries(updates)) {
        // Skip undefined values
        if (value === undefined) continue;

        const snakeKey = toSnakeCase(key);
        fields.push(`${snakeKey === 'key' ? '`key`' : snakeKey} = ?`);
        values.push(value);
      }

      // If no fields to update, return existing record
      if (fields.length === 0) {
        return this.findById(id);
      }

      values.push(id);
      const sql = `UPDATE events_content SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`;
      await pool.execute(sql, values);
      return this.findById(id);
    },

    async updateBySectionAndKey(section, key, updates) {
      const existing = await this.findBySectionAndKey(section, key);
      if (existing) {
        return this.update(existing.id, updates);
      }
      return null;
    },

    async upsertBySectionAndKey(section, key, data) {
      const existing = await this.findBySectionAndKey(section, key);

      if (existing) {
        return this.update(existing.id, data);
      } else {
        return this.create({ section, key, ...data });
      }
    },

    async bulkCreate(dataArray) {
      for (const data of dataArray) {
        await this.create(data);
      }
      return { count: dataArray.length };
    },

    async destroy(where) {
      const whereFields = [];
      const values = [];
      for (const [key, value] of Object.entries(where)) {
        whereFields.push(`${toSnakeCase(key)} = ?`);
        values.push(value);
      }
      const sql = `DELETE FROM events_content WHERE ${whereFields.join(' AND ')}`;
      const [result] = await pool.execute(sql, values);
      return { count: result.affectedRows };
    },

    async updateMany(where, data) {
      const fields = [];
      const values = [];

      for (const [key, value] of Object.entries(data)) {
        fields.push(`${toSnakeCase(key)} = ?`);
        values.push(value);
      }

      const whereFields = [];
      for (const [key, value] of Object.entries(where)) {
        whereFields.push(`${toSnakeCase(key)} = ?`);
        values.push(value);
      }

      const sql = `UPDATE events_content SET ${fields.join(', ')}, updated_at = NOW() WHERE ${whereFields.join(' AND ')}`;
      const [result] = await pool.execute(sql, values);
      return { count: result.affectedRows };
    },

    async delete(id) {
      await pool.execute('DELETE FROM events_content WHERE id = ?', [id]);
      return { id };
    },

    async deleteBySectionAndKey(section, key) {
      const existing = await this.findBySectionAndKey(section, key);
      if (existing) {
        return this.delete(existing.id);
      }
      return null;
    }
  },

  // About content operations
  aboutContent: {
    async create(contentData) {
      const id = uuidv4();
      const sql = `
        INSERT INTO about_content 
        (id, section, \`key\`, title, content, description, image_url, link_url, name, role, position, qualifications, 
         rating, date, icon, badge, order_index, is_active, metadata, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `;
      await pool.execute(sql, [
        id,
        contentData.section,
        contentData.key,
        contentData.title || null,
        contentData.content || null,
        contentData.description || null,
        contentData.imageUrl || null,
        contentData.linkUrl || null,
        contentData.name || null,
        contentData.role || null,
        contentData.position || null,
        contentData.qualifications || null,
        contentData.rating || null,
        contentData.date || null,
        contentData.icon || null,
        contentData.badge || null,
        contentData.orderIndex || null,
        contentData.isActive !== undefined ? contentData.isActive : true,
        contentData.metadata || null,
      ]);
      return this.findById(id);
    },

    async findAll(options = {}) {
      const { section, isActive = true } = options;
      let sql = 'SELECT * FROM about_content WHERE 1=1';
      const params = [];

      if (section) {
        sql += ' AND section = ?';
        params.push(section);
      }

      if (isActive !== undefined) {
        sql += ' AND is_active = ?';
        params.push(isActive);
      }

      sql += ' ORDER BY section ASC, order_index ASC, updated_at ASC';

      const [rows] = await pool.execute(sql, params);
      return rowsToCamel(rows);
    },

    async findBySection(section) {
      const [rows] = await pool.execute(
        'SELECT * FROM about_content WHERE section = ? AND is_active = 1 ORDER BY order_index ASC, updated_at ASC',
        [section]
      );
      return rowsToCamel(rows);
    },

    async findById(id) {
      const [rows] = await pool.execute('SELECT * FROM about_content WHERE id = ?', [id]);
      return rowToCamel(rows[0]);
    },

    async findBySectionAndKey(section, key) {
      const [rows] = await pool.execute(
        'SELECT * FROM about_content WHERE section = ? AND `key` = ?',
        [section, key]
      );
      return rowToCamel(rows[0]);
    },

    async update(id, updates) {
      const fields = [];
      const values = [];

      for (const [key, value] of Object.entries(updates)) {
        // Skip undefined values
        if (value === undefined) continue;

        const snakeKey = toSnakeCase(key);
        fields.push(`${snakeKey === 'key' ? '`key`' : snakeKey} = ?`);
        values.push(value);
      }

      // If no fields to update, return existing record
      if (fields.length === 0) {
        return this.findById(id);
      }

      values.push(id);
      const sql = `UPDATE about_content SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`;
      await pool.execute(sql, values);
      return this.findById(id);
    },

    async updateBySectionAndKey(section, key, updates) {
      const existing = await this.findBySectionAndKey(section, key);
      if (existing) {
        return this.update(existing.id, updates);
      }
      return null;
    },

    async upsertBySectionAndKey(section, key, data) {
      const existing = await this.findBySectionAndKey(section, key);

      if (existing) {
        return this.update(existing.id, data);
      } else {
        return this.create({ section, key, ...data });
      }
    },

    async bulkCreate(dataArray) {
      for (const data of dataArray) {
        await this.create(data);
      }
      return { count: dataArray.length };
    },

    async updateMany(where, data) {
      const fields = [];
      const values = [];

      for (const [key, value] of Object.entries(data)) {
        fields.push(`${toSnakeCase(key)} = ?`);
        values.push(value);
      }

      const whereFields = [];
      for (const [key, value] of Object.entries(where)) {
        whereFields.push(`${toSnakeCase(key)} = ?`);
        values.push(value);
      }

      const sql = `UPDATE about_content SET ${fields.join(', ')}, updated_at = NOW() WHERE ${whereFields.join(' AND ')}`;
      const [result] = await pool.execute(sql, values);
      return { count: result.affectedRows };
    },

    async delete(id) {
      await pool.execute('DELETE FROM about_content WHERE id = ?', [id]);
      return { id };
    },

    async deleteBySectionAndKey(section, key) {
      const existing = await this.findBySectionAndKey(section, key);
      if (existing) {
        return this.delete(existing.id);
      }
      return null;
    }
  },

  // Gallery operations
  gallery: {
    async create(galleryData) {
      const id = uuidv4();
      const sql = `
        INSERT INTO gallery 
        (id, title, description, image_url, video_url, category, item_type, album_id, icon, order_index, 
         tags, is_featured, is_active, uploaded_by, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
      await pool.execute(sql, [
        id,
        galleryData.title,
        galleryData.description || null,
        galleryData.imageUrl,
        galleryData.videoUrl || null,
        galleryData.category || null,
        galleryData.itemType,
        galleryData.albumId || null,
        galleryData.icon || null,
        galleryData.orderIndex || 0,
        galleryData.tags || '',
        galleryData.isFeatured || false,
        galleryData.isActive !== undefined ? galleryData.isActive : true,
        galleryData.uploadedBy || null,
      ]);
      return this.findUnique({ where: { id } });
    },

    async findMany(options = {}) {
      const { where, orderBy } = options;
      let sql = 'SELECT * FROM gallery WHERE 1=1';
      const params = [];

      if (where) {
        for (const [key, value] of Object.entries(where)) {
          sql += ` AND ${toSnakeCase(key)} = ?`;
          params.push(value);
        }
      }

      if (orderBy) {
        const orderFields = [];
        for (const [key, dir] of Object.entries(orderBy)) {
          orderFields.push(`${toSnakeCase(key)} ${dir.toUpperCase()}`);
        }
        sql += ` ORDER BY ${orderFields.join(', ')}`;
      }

      const [rows] = await pool.execute(sql, params);
      return rowsToCamel(rows);
    },

    async findFirst(options = {}) {
      const results = await this.findMany(options);
      return results[0] || null;
    },

    async findUnique(options = {}) {
      const { where } = options;
      let sql = 'SELECT * FROM gallery WHERE 1=1';
      const params = [];

      if (where) {
        for (const [key, value] of Object.entries(where)) {
          sql += ` AND ${toSnakeCase(key)} = ?`;
          params.push(value);
        }
      }

      sql += ' LIMIT 1';

      const [rows] = await pool.execute(sql, params);
      return rowToCamel(rows[0]);
    },

    async update(id, updates) {
      const fields = [];
      const values = [];

      for (const [key, value] of Object.entries(updates)) {
        // Skip undefined values
        if (value === undefined) continue;

        fields.push(`${toSnakeCase(key)} = ?`);
        values.push(value);
      }

      // If no fields to update, return existing record
      if (fields.length === 0) {
        return this.findUnique({ where: { id } });
      }

      values.push(id);
      const sql = `UPDATE gallery SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`;
      await pool.execute(sql, values);
      return this.findUnique({ where: { id } });
    },

    async delete(id) {
      await pool.execute('DELETE FROM gallery WHERE id = ?', [id]);
      return { id };
    },

    async deleteMany(options = {}) {
      const { where } = options;
      let sql = 'DELETE FROM gallery WHERE 1=1';
      const params = [];

      if (where) {
        for (const [key, value] of Object.entries(where)) {
          sql += ` AND ${toSnakeCase(key)} = ?`;
          params.push(value);
        }
      }

      const [result] = await pool.execute(sql, params);
      return { count: result.affectedRows };
    },

    async count(options = {}) {
      const { where } = options;
      let sql = 'SELECT COUNT(*) as count FROM gallery WHERE 1=1';
      const params = [];

      if (where) {
        for (const [key, value] of Object.entries(where)) {
          sql += ` AND ${toSnakeCase(key)} = ?`;
          params.push(value);
        }
      }

      const [rows] = await pool.execute(sql, params);
      return rows[0].count;
    },

    async findHero() {
      return this.findFirst({
        where: { itemType: 'hero', isActive: true }
      });
    },

    async findAlbums(type = null) {
      const where = { itemType: 'album', isActive: true };
      if (type) {
        where.category = type;
      }

      return this.findMany({
        where,
        orderBy: { orderIndex: 'asc' }
      });
    },

    async findFeaturedMoments() {
      return this.findMany({
        where: { itemType: 'featured_moment', isActive: true },
        orderBy: { orderIndex: 'asc' }
      });
    },

    async findAlbumItems(albumId, itemType = null) {
      const where = { albumId, isActive: true };
      if (itemType) {
        where.itemType = itemType;
      }

      return this.findMany({
        where,
        orderBy: { orderIndex: 'asc' }
      });
    }
  },

  // Password reset tokens
  passwordResetTokens: {
    async create(tokenData) {
      const id = uuidv4();
      const sql = `
        INSERT INTO password_reset_tokens (id, email, otp_code, expires_at, is_used, created_at)
        VALUES (?, ?, ?, ?, ?, NOW())
      `;
      await pool.execute(sql, [
        id,
        tokenData.email,
        tokenData.otpCode,
        tokenData.expiresAt,
        tokenData.isUsed || false,
      ]);

      const [rows] = await pool.execute('SELECT * FROM password_reset_tokens WHERE id = ?', [id]);
      return rowToCamel(rows[0]);
    },

    async findFirst(options = {}) {
      const { where, orderBy } = options;
      let sql = 'SELECT * FROM password_reset_tokens WHERE 1=1';
      const params = [];

      if (where) {
        for (const [key, value] of Object.entries(where)) {
          sql += ` AND ${toSnakeCase(key)} = ?`;
          params.push(value);
        }
      }

      if (orderBy) {
        const orderFields = [];
        for (const [key, dir] of Object.entries(orderBy)) {
          orderFields.push(`${toSnakeCase(key)} ${dir.toUpperCase()}`);
        }
        sql += ` ORDER BY ${orderFields.join(', ')}`;
      }

      sql += ' LIMIT 1';

      const [rows] = await pool.execute(sql, params);
      return rowToCamel(rows[0]);
    },

    async update(id, updates) {
      const fields = [];
      const values = [];

      for (const [key, value] of Object.entries(updates)) {
        // Skip undefined values
        if (value === undefined) continue;

        fields.push(`${toSnakeCase(key)} = ?`);
        values.push(value);
      }

      // If no fields to update, return existing record
      if (fields.length === 0) {
        const [rows] = await pool.execute('SELECT * FROM password_reset_tokens WHERE id = ?', [id]);
        return rowToCamel(rows[0]);
      }

      values.push(id);
      const sql = `UPDATE password_reset_tokens SET ${fields.join(', ')} WHERE id = ?`;
      await pool.execute(sql, values);

      const [rows] = await pool.execute('SELECT * FROM password_reset_tokens WHERE id = ?', [id]);
      return rowToCamel(rows[0]);
    },

    async delete(id) {
      await pool.execute('DELETE FROM password_reset_tokens WHERE id = ?', [id]);
      return { id };
    },

    async deleteMany(options = {}) {
      const { where } = options;
      let sql = 'DELETE FROM password_reset_tokens WHERE 1=1';
      const params = [];

      if (where) {
        for (const [key, value] of Object.entries(where)) {
          if (key === 'OR') {
            // Handle OR conditions
            const orConditions = [];
            for (const orWhere of value) {
              for (const [orKey, orValue] of Object.entries(orWhere)) {
                if (orKey === 'expiresAt' && orValue.lt) {
                  orConditions.push('expires_at < ?');
                  params.push(orValue.lt);
                } else {
                  orConditions.push(`${toSnakeCase(orKey)} = ?`);
                  params.push(orValue);
                }
              }
            }
            sql += ` AND (${orConditions.join(' OR ')})`;
          } else {
            sql += ` AND ${toSnakeCase(key)} = ?`;
            params.push(value);
          }
        }
      }

      const [result] = await pool.execute(sql, params);
      return { count: result.affectedRows };
    },

    async cleanupExpired() {
      const sql = `DELETE FROM password_reset_tokens WHERE expires_at < NOW() OR is_used = 1`;
      const [result] = await pool.execute(sql);
      return { count: result.affectedRows };
    }
  },

  // General settings operations  
  generalSettings: {
    async create(settingsData) {
      const id = uuidv4();
      const sql = `
        INSERT INTO general_settings 
        (id, site_name, site_name_second, site_description, site_logo, site_favicon, 
         main_contact_email, main_contact_phone, school_address, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
      await pool.execute(sql, [
        id,
        settingsData.siteName || null,
        settingsData.siteNameSecond || null,
        settingsData.siteDescription || null,
        settingsData.siteLogo || null,
        settingsData.siteFavicon || null,
        settingsData.mainContactEmail || null,
        settingsData.mainContactPhone || null,
        settingsData.schoolAddress || null,
      ]);

      const [rows] = await pool.execute('SELECT * FROM general_settings WHERE id = ?', [id]);
      return rowToCamel(rows[0]);
    },

    async findFirst() {
      const [rows] = await pool.execute('SELECT * FROM general_settings LIMIT 1');
      return rowToCamel(rows[0]);
    },

    async update(id, updates) {
      // Safety check for null/undefined updates
      if (!updates || typeof updates !== 'object' || Object.keys(updates).length === 0) {
        console.error('❌ Invalid updates object:', updates);
        throw new Error('Updates parameter must be a non-empty object');
      }

      const fields = [];
      const values = [];

      // Filter out undefined values and convert empty strings to null for optional fields
      for (const [key, value] of Object.entries(updates)) {
        // Skip undefined values
        if (value === undefined) {
          continue;
        }

        // Convert empty strings to null for logo/favicon fields
        let finalValue = value;
        if ((key === 'siteLogo' || key === 'siteFavicon') && value === '') {
          finalValue = null;
        }

        fields.push(`${toSnakeCase(key)} = ?`);
        values.push(finalValue);
      }

      // If no fields to update after filtering, return existing record
      if (fields.length === 0) {
        const [rows] = await pool.execute('SELECT * FROM general_settings WHERE id = ?', [id]);
        return rowToCamel(rows[0]);
      }

      values.push(id);
      const sql = `UPDATE general_settings SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`;
      await pool.execute(sql, values);

      const [rows] = await pool.execute('SELECT * FROM general_settings WHERE id = ?', [id]);
      return rowToCamel(rows[0]);
    },

    async upsert(data) {
      const existing = await this.findFirst();

      if (existing) {
        return this.update(existing.id, data);
      } else {
        return this.create(data);
      }
    }
  },

  // Alumni operations
  alumni: {
    async create(alumniData) {
      const id = uuidv4();
      const sql = `
        INSERT INTO alumni 
        (id, name, batch_year, profession, university, quote, testimonial, photo_url, is_featured, 
         is_top_achiever, order_index, is_active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
      await pool.execute(sql, [
        id,
        alumniData.name,
        alumniData.batchYear,
        alumniData.profession,
        alumniData.university || null,
        alumniData.quote || null,
        alumniData.testimonial || null,
        alumniData.photoUrl || null,
        alumniData.isFeatured || false,
        alumniData.isTopAchiever || false,
        alumniData.orderIndex || 0,
        alumniData.isActive !== undefined ? alumniData.isActive : true,
      ]);

      const [rows] = await pool.execute('SELECT * FROM alumni WHERE id = ?', [id]);
      return rowToCamel(rows[0]);
    },

    async findMany(options = {}) {
      const { where, orderBy, take, skip } = options;
      let sql = 'SELECT * FROM alumni WHERE 1=1';
      const params = [];

      if (where) {
        // Handle OR conditions for search
        if (where.OR && Array.isArray(where.OR)) {
          const orConditions = [];
          where.OR.forEach(condition => {
            for (const [key, value] of Object.entries(condition)) {
              if (value && typeof value === 'object' && value.contains) {
                // Handle contains (LIKE query) - ignore mode: 'insensitive' for MySQL
                orConditions.push(`${toSnakeCase(key)} LIKE ?`);
                params.push(`%${value.contains}%`);
              } else if (value !== undefined && value !== null) {
                orConditions.push(`${toSnakeCase(key)} = ?`);
                params.push(value);
              }
            }
          });
          if (orConditions.length > 0) {
            sql += ` AND (${orConditions.join(' OR ')})`;
          }
        }

        // Handle other where conditions (excluding OR which we already handled)
        for (const [key, value] of Object.entries(where)) {
          if (key === 'OR') continue; // Skip OR, already handled

          if (value && typeof value === 'object') {
            // Handle object conditions (gte, lte, contains, etc.)
            if (value.gte !== undefined) {
              sql += ` AND ${toSnakeCase(key)} >= ?`;
              params.push(value.gte);
            } else if (value.contains !== undefined) {
              sql += ` AND ${toSnakeCase(key)} LIKE ?`;
              params.push(`%${value.contains}%`);
            } else {
              // Default to equality
              sql += ` AND ${toSnakeCase(key)} = ?`;
              params.push(value);
            }
          } else if (value !== undefined && value !== null) {
            sql += ` AND ${toSnakeCase(key)} = ?`;
            // Convert boolean to 1/0 for MySQL compatibility
            params.push(typeof value === 'boolean' ? (value ? 1 : 0) : value);
          }
        }
      }

      if (orderBy) {
        const orderFields = [];
        for (const [key, dir] of Object.entries(orderBy)) {
          orderFields.push(`${toSnakeCase(key)} ${dir.toUpperCase()}`);
        }
        sql += ` ORDER BY ${orderFields.join(', ')}`;
      } else {
        sql += ' ORDER BY order_index ASC';
      }

      if (skip) {
        sql += ' OFFSET ?';
        params.push(skip);
      }

      if (take) {
        sql += ' LIMIT ?';
        params.push(take);
      }

      const [rows] = await pool.execute(sql, params);
      return rowsToCamel(rows);
    },

    async count(options = {}) {
      const { where } = options;
      let sql = 'SELECT COUNT(*) as count FROM alumni WHERE 1=1';
      const params = [];

      if (where) {
        // Handle OR conditions for search
        if (where.OR && Array.isArray(where.OR)) {
          const orConditions = [];
          where.OR.forEach(condition => {
            for (const [key, value] of Object.entries(condition)) {
              if (value && typeof value === 'object' && value.contains) {
                // Handle contains (LIKE query)
                orConditions.push(`${toSnakeCase(key)} LIKE ?`);
                params.push(`%${value.contains}%`);
              } else if (value !== undefined && value !== null) {
                orConditions.push(`${toSnakeCase(key)} = ?`);
                params.push(value);
              }
            }
          });
          if (orConditions.length > 0) {
            sql += ` AND (${orConditions.join(' OR ')})`;
          }
        }

        // Handle other where conditions (excluding OR which we already handled)
        for (const [key, value] of Object.entries(where)) {
          if (key === 'OR') continue; // Skip OR, already handled

          if (value && typeof value === 'object') {
            // Handle object conditions (gte, lte, contains, etc.)
            if (value.gte !== undefined) {
              sql += ` AND ${toSnakeCase(key)} >= ?`;
              params.push(value.gte);
            } else if (value.contains !== undefined) {
              sql += ` AND ${toSnakeCase(key)} LIKE ?`;
              params.push(`%${value.contains}%`);
            } else {
              // Default to equality
              sql += ` AND ${toSnakeCase(key)} = ?`;
              params.push(value);
            }
          } else if (value !== undefined && value !== null) {
            sql += ` AND ${toSnakeCase(key)} = ?`;
            // Convert boolean to 1/0 for MySQL compatibility
            params.push(typeof value === 'boolean' ? (value ? 1 : 0) : value);
          }
        }
      }

      const [rows] = await pool.execute(sql, params);
      return rows[0].count;
    },

    async findUnique(options = {}) {
      const { where } = options;
      let sql = 'SELECT * FROM alumni WHERE 1=1';
      const params = [];

      if (where) {
        for (const [key, value] of Object.entries(where)) {
          sql += ` AND ${toSnakeCase(key)} = ?`;
          params.push(value);
        }
      }

      sql += ' LIMIT 1';

      const [rows] = await pool.execute(sql, params);
      return rowToCamel(rows[0]);
    },

    async update(id, updates) {
      const fields = [];
      const values = [];

      for (const [key, value] of Object.entries(updates)) {
        // Skip undefined values
        if (value === undefined) continue;

        fields.push(`${toSnakeCase(key)} = ?`);
        values.push(value);
      }

      // If no fields to update, return existing record
      if (fields.length === 0) {
        const [rows] = await pool.execute('SELECT * FROM alumni WHERE id = ?', [id]);
        return rowToCamel(rows[0]);
      }

      values.push(id);
      const sql = `UPDATE alumni SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`;
      await pool.execute(sql, values);

      const [rows] = await pool.execute('SELECT * FROM alumni WHERE id = ?', [id]);
      return rowToCamel(rows[0]);
    },

    async delete(id) {
      await pool.execute('DELETE FROM alumni WHERE id = ?', [id]);
      return { id };
    },

    async createMany(dataArray) {
      for (const data of dataArray.data) {
        await this.create(data);
      }
      return { count: dataArray.data.length };
    }
  },

  // NEB Toppers operations
  nebToppers: {
    async create(topperData) {
      const id = uuidv4();
      const sql = `
        INSERT INTO neb_toppers 
        (id, name, batch_year, gpa, faculty, quote, photo_url, order_index, is_active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
      await pool.execute(sql, [
        id,
        topperData.name,
        topperData.batchYear,
        topperData.gpa,
        topperData.faculty || null,
        topperData.quote || null,
        topperData.photoUrl || null,
        topperData.orderIndex || 0,
        topperData.isActive !== undefined ? topperData.isActive : true,
      ]);

      const [rows] = await pool.execute('SELECT * FROM neb_toppers WHERE id = ?', [id]);
      return rowToCamel(rows[0]);
    },

    async findMany(options = {}) {
      const { where, orderBy, take } = options;
      let sql = 'SELECT * FROM neb_toppers WHERE 1=1';
      const params = [];

      if (where) {
        for (const [key, value] of Object.entries(where)) {
          sql += ` AND ${toSnakeCase(key)} = ?`;
          params.push(value);
        }
      }

      if (orderBy) {
        const orderFields = [];
        // Handle both object and array formats
        if (Array.isArray(orderBy)) {
          for (const orderItem of orderBy) {
            for (const [key, dir] of Object.entries(orderItem)) {
              orderFields.push(`${toSnakeCase(key)} ${dir.toUpperCase()}`);
            }
          }
        } else {
          for (const [key, dir] of Object.entries(orderBy)) {
            orderFields.push(`${toSnakeCase(key)} ${dir.toUpperCase()}`);
          }
        }
        sql += ` ORDER BY ${orderFields.join(', ')}`;
      } else {
        sql += ' ORDER BY order_index ASC';
      }

      if (take) {
        sql += ` LIMIT ${parseInt(take)}`;
      }

      const [rows] = await pool.execute(sql, params);
      return rowsToCamel(rows);
    },

    async findUnique(options = {}) {
      const { where } = options;
      let sql = 'SELECT * FROM neb_toppers WHERE 1=1';
      const params = [];

      if (where) {
        for (const [key, value] of Object.entries(where)) {
          sql += ` AND ${toSnakeCase(key)} = ?`;
          params.push(value);
        }
      }

      sql += ' LIMIT 1';

      const [rows] = await pool.execute(sql, params);
      return rowToCamel(rows[0]);
    },

    async update(id, updates) {
      const fields = [];
      const values = [];

      for (const [key, value] of Object.entries(updates)) {
        // Skip undefined values
        if (value === undefined) continue;

        fields.push(`${toSnakeCase(key)} = ?`);
        values.push(value);
      }

      // If no fields to update, return existing record
      if (fields.length === 0) {
        const [rows] = await pool.execute('SELECT * FROM neb_toppers WHERE id = ?', [id]);
        return rowToCamel(rows[0]);
      }

      values.push(id);
      const sql = `UPDATE neb_toppers SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`;
      await pool.execute(sql, values);

      const [rows] = await pool.execute('SELECT * FROM neb_toppers WHERE id = ?', [id]);
      return rowToCamel(rows[0]);
    },

    async delete(id) {
      await pool.execute('DELETE FROM neb_toppers WHERE id = ?', [id]);
      return { id };
    },

    async createMany(dataArray) {
      for (const data of dataArray.data) {
        await this.create(data);
      }
      return { count: dataArray.data.length };
    }
  },

  // Admission applications operations
  admissionApplications: {
    async create(applicationData) {
      const id = uuidv4();

      // Get next application number
      const [maxResult] = await pool.execute('SELECT MAX(application_number) as maxNum FROM admission_applications');
      const nextNumber = (maxResult[0].maxNum || 0) + 1;

      const sql = `
        INSERT INTO admission_applications 
        (id, application_number, first_name, last_name, date_of_birth, gender, grade_applied_for, current_school,
         guardian_name, guardian_phone, guardian_email, guardian_occupation, address_line, city, state, postal_code,
         newsletter_consent, terms_accepted, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
      await pool.execute(sql, [
        id,
        nextNumber,
        applicationData.firstName,
        applicationData.lastName,
        applicationData.dateOfBirth,
        applicationData.gender,
        applicationData.gradeAppliedFor,
        applicationData.currentSchool || null,
        applicationData.guardianName,
        applicationData.guardianPhone,
        applicationData.guardianEmail || null,
        applicationData.guardianOccupation || null,
        applicationData.addressLine,
        applicationData.city,
        applicationData.state || null,
        applicationData.postalCode || null,
        applicationData.newsletterConsent || false,
        applicationData.termsAccepted || false,
        applicationData.status || 'PENDING',
      ]);

      const [rows] = await pool.execute('SELECT * FROM admission_applications WHERE id = ?', [id]);
      return rowToCamel(rows[0]);
    },

    async findMany(options = {}) {
      const { orderBy, take, skip } = options;
      let sql = 'SELECT * FROM admission_applications WHERE 1=1';
      const params = [];

      if (orderBy) {
        const orderFields = [];
        for (const [key, dir] of Object.entries(orderBy)) {
          orderFields.push(`${toSnakeCase(key)} ${dir.toUpperCase()}`);
        }
        sql += ` ORDER BY ${orderFields.join(', ')}`;
      }

      if (take) {
        sql += ' LIMIT ?';
        params.push(take);
      }

      if (skip) {
        sql += ' OFFSET ?';
        params.push(skip);
      }

      const [rows] = await pool.execute(sql, params);
      return rowsToCamel(rows);
    },

    async count(options = {}) {
      const { where } = options;
      let sql = 'SELECT COUNT(*) as count FROM admission_applications WHERE 1=1';
      const params = [];

      if (where) {
        for (const [key, value] of Object.entries(where)) {
          sql += ` AND ${toSnakeCase(key)} = ?`;
          params.push(value);
        }
      }

      const [rows] = await pool.execute(sql, params);
      return rows[0].count;
    },

    async findUnique(options = {}) {
      const { where } = options;
      let sql = 'SELECT * FROM admission_applications WHERE 1=1';
      const params = [];

      if (where) {
        for (const [key, value] of Object.entries(where)) {
          sql += ` AND ${toSnakeCase(key)} = ?`;
          params.push(value);
        }
      }

      sql += ' LIMIT 1';

      const [rows] = await pool.execute(sql, params);
      return rowToCamel(rows[0]);
    },

    async update(id, updates) {
      const fields = [];
      const values = [];

      for (const [key, value] of Object.entries(updates)) {
        // Skip undefined values
        if (value === undefined) continue;

        fields.push(`${toSnakeCase(key)} = ?`);
        values.push(value);
      }

      // If no fields to update, return existing record
      if (fields.length === 0) {
        const [rows] = await pool.execute('SELECT * FROM admission_applications WHERE id = ?', [id]);
        return rowToCamel(rows[0]);
      }

      values.push(id);
      const sql = `UPDATE admission_applications SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`;
      await pool.execute(sql, values);

      const [rows] = await pool.execute('SELECT * FROM admission_applications WHERE id = ?', [id]);
      return rowToCamel(rows[0]);
    },

    async delete(id) {
      await pool.execute('DELETE FROM admission_applications WHERE id = ?', [id]);
      return { id };
    }
  },

  // Contact submissions operations
  contactSubmissions: {
    async create(submissionData) {
      const id = uuidv4();
      const sql = `
        INSERT INTO contact_submissions 
        (id, full_name, email, country_code, phone, message, status, ip_address, user_agent, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
      await pool.execute(sql, [
        id,
        submissionData.fullName,
        submissionData.email,
        submissionData.countryCode,
        submissionData.phone,
        submissionData.message,
        submissionData.status || 'NEW',
        submissionData.ipAddress || null,
        submissionData.userAgent || null,
      ]);

      const [rows] = await pool.execute('SELECT * FROM contact_submissions WHERE id = ?', [id]);
      return rowToCamel(rows[0]);
    },

    async findMany(options = {}) {
      const { where, orderBy, take, skip } = options;
      let sql = 'SELECT * FROM contact_submissions WHERE 1=1';
      const params = [];

      if (where) {
        // Handle OR conditions for search
        if (where.OR && Array.isArray(where.OR)) {
          const orConditions = [];
          where.OR.forEach(condition => {
            for (const [key, value] of Object.entries(condition)) {
              if (value && typeof value === 'object' && value.contains) {
                // Handle contains (LIKE query) - ignore mode: 'insensitive' for MySQL
                orConditions.push(`${toSnakeCase(key)} LIKE ?`);
                params.push(`%${value.contains}%`);
              } else if (value !== undefined && value !== null) {
                orConditions.push(`${toSnakeCase(key)} = ?`);
                params.push(value);
              }
            }
          });
          if (orConditions.length > 0) {
            sql += ` AND (${orConditions.join(' OR ')})`;
          }
        }

        // Handle other where conditions (excluding OR which we already handled)
        for (const [key, value] of Object.entries(where)) {
          if (key === 'OR') continue; // Skip OR, already handled

          if (value && typeof value === 'object') {
            // Handle object conditions (gte, lte, contains, etc.)
            if (value.gte !== undefined) {
              sql += ` AND ${toSnakeCase(key)} >= ?`;
              params.push(value.gte);
            } else if (value.contains !== undefined) {
              sql += ` AND ${toSnakeCase(key)} LIKE ?`;
              params.push(`%${value.contains}%`);
            } else {
              // Default to equality
              sql += ` AND ${toSnakeCase(key)} = ?`;
              params.push(value);
            }
          } else if (value !== undefined && value !== null) {
            sql += ` AND ${toSnakeCase(key)} = ?`;
            // Convert boolean to 1/0 for MySQL compatibility
            params.push(typeof value === 'boolean' ? (value ? 1 : 0) : value);
          }
        }
      }

      if (orderBy) {
        const orderFields = [];
        for (const [key, dir] of Object.entries(orderBy)) {
          orderFields.push(`${toSnakeCase(key)} ${dir.toUpperCase()}`);
        }
        sql += ` ORDER BY ${orderFields.join(', ')}`;
      }

      if (skip) {
        sql += ' OFFSET ?';
        params.push(skip);
      }

      if (take) {
        sql += ' LIMIT ?';
        params.push(take);
      }

      const [rows] = await pool.execute(sql, params);
      return rowsToCamel(rows);
    },

    async count(options = {}) {
      const { where } = options;
      let sql = 'SELECT COUNT(*) as count FROM contact_submissions WHERE 1=1';
      const params = [];

      if (where) {
        // Handle OR conditions for search
        if (where.OR && Array.isArray(where.OR)) {
          const orConditions = [];
          where.OR.forEach(condition => {
            for (const [key, value] of Object.entries(condition)) {
              if (value && typeof value === 'object' && value.contains) {
                // Handle contains (LIKE query)
                orConditions.push(`${toSnakeCase(key)} LIKE ?`);
                params.push(`%${value.contains}%`);
              } else if (value !== undefined && value !== null) {
                orConditions.push(`${toSnakeCase(key)} = ?`);
                params.push(value);
              }
            }
          });
          if (orConditions.length > 0) {
            sql += ` AND (${orConditions.join(' OR ')})`;
          }
        }

        // Handle other where conditions (excluding OR which we already handled)
        for (const [key, value] of Object.entries(where)) {
          if (key === 'OR') continue; // Skip OR, already handled

          if (value && typeof value === 'object') {
            // Handle object conditions (gte, lte, contains, etc.)
            if (value.gte !== undefined) {
              sql += ` AND ${toSnakeCase(key)} >= ?`;
              params.push(value.gte);
            } else if (value.contains !== undefined) {
              sql += ` AND ${toSnakeCase(key)} LIKE ?`;
              params.push(`%${value.contains}%`);
            } else {
              // Default to equality
              sql += ` AND ${toSnakeCase(key)} = ?`;
              params.push(value);
            }
          } else if (value !== undefined && value !== null) {
            sql += ` AND ${toSnakeCase(key)} = ?`;
            // Convert boolean to 1/0 for MySQL compatibility
            params.push(typeof value === 'boolean' ? (value ? 1 : 0) : value);
          }
        }
      }

      const [rows] = await pool.execute(sql, params);
      return rows[0].count;
    },

    async findUnique(options = {}) {
      const { where } = options;
      let sql = 'SELECT * FROM contact_submissions WHERE 1=1';
      const params = [];

      if (where) {
        for (const [key, value] of Object.entries(where)) {
          sql += ` AND ${toSnakeCase(key)} = ?`;
          params.push(value);
        }
      }

      sql += ' LIMIT 1';

      const [rows] = await pool.execute(sql, params);
      return rowToCamel(rows[0]);
    },

    async findById(id) {
      const [rows] = await pool.execute('SELECT * FROM contact_submissions WHERE id = ?', [id]);
      return rowToCamel(rows[0]);
    },

    async update(id, updates) {
      const fields = [];
      const values = [];

      for (const [key, value] of Object.entries(updates)) {
        // Skip undefined values
        if (value === undefined) continue;

        fields.push(`${toSnakeCase(key)} = ?`);
        values.push(value);
      }

      // If no fields to update, return existing record
      if (fields.length === 0) {
        const [rows] = await pool.execute('SELECT * FROM contact_submissions WHERE id = ?', [id]);
        return rowToCamel(rows[0]);
      }

      values.push(id);
      const sql = `UPDATE contact_submissions SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`;
      await pool.execute(sql, values);

      const [rows] = await pool.execute('SELECT * FROM contact_submissions WHERE id = ?', [id]);
      return rowToCamel(rows[0]);
    },

    async delete(id) {
      await pool.execute('DELETE FROM contact_submissions WHERE id = ?', [id]);
      return { id };
    }
  },

  // Popup Notices operations
  popupNotices: {
    async create(noticeData) {
      const id = uuidv4();
      const sql = `
        INSERT INTO popup_notices 
        (id, image_url, is_enabled, order_index, created_at, updated_at)
        VALUES (?, ?, ?, ?, NOW(), NOW())
      `;
      await pool.execute(sql, [
        id,
        noticeData.imageUrl,
        noticeData.isEnabled !== undefined ? noticeData.isEnabled : true,
        noticeData.orderIndex || 0,
      ]);
      return this.findById(id);
    },

    async findMany(options = {}) {
      const { where, orderBy } = options;
      let sql = 'SELECT * FROM popup_notices WHERE 1=1';
      const params = [];

      if (where) {
        for (const [key, value] of Object.entries(where)) {
          sql += ` AND ${toSnakeCase(key)} = ?`;
          params.push(value);
        }
      }

      if (orderBy) {
        const orderFields = [];
        for (const [key, dir] of Object.entries(orderBy)) {
          orderFields.push(`${toSnakeCase(key)} ${dir.toUpperCase()}`);
        }
        sql += ` ORDER BY ${orderFields.join(', ')}`;
      } else {
        sql += ' ORDER BY order_index ASC, created_at DESC';
      }

      const [rows] = await pool.execute(sql, params);
      return rowsToCamel(rows);
    },

    async findActive() {
      const [rows] = await pool.execute(
        'SELECT * FROM popup_notices WHERE is_enabled = 1 ORDER BY order_index ASC, created_at DESC'
      );
      return rowsToCamel(rows);
    },

    async findById(id) {
      const [rows] = await pool.execute('SELECT * FROM popup_notices WHERE id = ?', [id]);
      return rowToCamel(rows[0]);
    },

    async update(id, updates) {
      const fields = [];
      const values = [];

      for (const [key, value] of Object.entries(updates)) {
        // Skip undefined values
        if (value === undefined) continue;

        fields.push(`${toSnakeCase(key)} = ?`);
        values.push(value);
      }

      // If no fields to update, return existing record
      if (fields.length === 0) {
        return this.findById(id);
      }

      values.push(id);
      const sql = `UPDATE popup_notices SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`;
      await pool.execute(sql, values);
      return this.findById(id);
    },

    async delete(id) {
      await pool.execute('DELETE FROM popup_notices WHERE id = ?', [id]);
      return { id };
    },

    async deleteMany(where) {
      const whereFields = [];
      const values = [];
      for (const [key, value] of Object.entries(where)) {
        whereFields.push(`${toSnakeCase(key)} = ?`);
        values.push(value);
      }
      const sql = `DELETE FROM popup_notices WHERE ${whereFields.join(' AND ')}`;
      const [result] = await pool.execute(sql, values);
      return { count: result.affectedRows };
    },

    async count(options = {}) {
      const { where } = options;
      let sql = 'SELECT COUNT(*) as count FROM popup_notices WHERE 1=1';
      const params = [];

      if (where) {
        for (const [key, value] of Object.entries(where)) {
          sql += ` AND ${toSnakeCase(key)} = ?`;
          params.push(value);
        }
      }

      const [rows] = await pool.execute(sql, params);
      return rows[0].count;
    }
  },

  // Blogs operations (if needed for future use)
  blogs: {
    async create(blogData) {
      const id = uuidv4();
      const sql = `
        INSERT INTO blogs 
        (id, title, content, excerpt, featured_image, author_id, tags, status, published_at, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
      await pool.execute(sql, [
        id,
        blogData.title,
        blogData.content,
        blogData.excerpt || null,
        blogData.featuredImage || null,
        blogData.authorId || null,
        blogData.tags || '',
        blogData.status || 'DRAFT',
        blogData.publishedAt || null,
      ]);

      const [rows] = await pool.execute('SELECT * FROM blogs WHERE id = ?', [id]);
      return rowToCamel(rows[0]);
    },

    async findMany(options = {}) {
      const { where, orderBy, take, skip, include } = options;
      let sql = 'SELECT blogs.* FROM blogs WHERE 1=1';
      const params = [];

      if (where) {
        for (const [key, value] of Object.entries(where)) {
          sql += ` AND ${toSnakeCase(key)} = ?`;
          params.push(value);
        }
      }

      if (orderBy) {
        const orderFields = [];
        for (const [key, dir] of Object.entries(orderBy)) {
          orderFields.push(`${toSnakeCase(key)} ${dir.toUpperCase()}`);
        }
        sql += ` ORDER BY ${orderFields.join(', ')}`;
      }

      if (take) {
        sql += ' LIMIT ?';
        params.push(take);
      }

      if (skip) {
        sql += ' OFFSET ?';
        params.push(skip);
      }

      const [rows] = await pool.execute(sql, params);
      return rowsToCamel(rows);
    },

    async findUnique(options = {}) {
      const { where } = options;
      let sql = 'SELECT * FROM blogs WHERE 1=1';
      const params = [];

      if (where) {
        for (const [key, value] of Object.entries(where)) {
          sql += ` AND ${toSnakeCase(key)} = ?`;
          params.push(value);
        }
      }

      sql += ' LIMIT 1';

      const [rows] = await pool.execute(sql, params);
      return rowToCamel(rows[0]);
    },

    async update(id, updates) {
      const fields = [];
      const values = [];

      for (const [key, value] of Object.entries(updates)) {
        // Skip undefined values
        if (value === undefined) continue;

        fields.push(`${toSnakeCase(key)} = ?`);
        values.push(value);
      }

      // If no fields to update, return existing record
      if (fields.length === 0) {
        const [rows] = await pool.execute('SELECT * FROM blogs WHERE id = ?', [id]);
        return rowToCamel(rows[0]);
      }

      values.push(id);
      const sql = `UPDATE blogs SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`;
      await pool.execute(sql, values);

      const [rows] = await pool.execute('SELECT * FROM blogs WHERE id = ?', [id]);
      return rowToCamel(rows[0]);
    },

    async delete(id) {
      await pool.execute('DELETE FROM blogs WHERE id = ?', [id]);
      return { id };
    }
  },

  // downloads operations 
  downloads: {
    async create(downloadData) {
      const id = uuidv4();

      const sql = `
        INSERT INTO downloads (
          id,
          main_title,
          main_description,
          category,
          academic_year,
          class,
          subject,
          category_title,
          file_name,
          cloudinary_public_id,
          file_type,
          file_size_kb,
          file_url,
          icon_name,
          is_active,
          created_by,
          updated_by,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;

      await pool.execute(sql, [
        id,
        downloadData.mainTitle || null,
        downloadData.mainDescription || null,
        downloadData.category || null,
        downloadData.academicYear || null,
        downloadData.class || null,
        downloadData.subject || null,
        downloadData.categoryTitle || null,
        downloadData.fileName || null,
        downloadData.cloudinaryPublicId || null,
        downloadData.fileType || null,
        downloadData.fileSizeKb || null,
        downloadData.fileUrl || null,
        downloadData.iconName || null,
        downloadData.isActive !== undefined ? downloadData.isActive : 'active',
        downloadData.createdBy || null,
        downloadData.updatedBy || null,
      ]);

      return this.findById(id);
    },


    async findById(id) {
      const [rows] = await pool.execute('SELECT * FROM downloads WHERE id = ?', [id]);
      return rowToCamel(rows[0]);
    },

    async findAll() {
      try {        
        const [rows] = await pool.execute(`SELECT * FROM downloads`);
        return rows
      } catch (exception) {
        throw exception;
      }
    },

    async findAllRowByFilter(filter, value="") {
      try {        
        const [rows] = await pool.execute(`SELECT * FROM downloads WHERE ${filter} = ?`, [value]);
    
        return rows
    
      } catch (exception) {
        throw exception;
      }
    },


    async update(id, updates) {
      // 1️⃣ Check if record exists
      const existing = await this.findById(id);
      if (!existing) {
          throw new Error("Record not found");
      }
  
      const fields = [];
      const values = [];
  
      for (const [key, value] of Object.entries(updates)) {
          if (value === undefined) continue;
  
          const snakeKey = toSnakeCase(key);
  
          fields.push(`${snakeKey === 'key' ? '`key`' : snakeKey} = ?`);
          values.push(value);
      }
  
      if (fields.length === 0) {
          return existing;
      }
  
      // 2️⃣ Always update timestamp
      fields.push(`updated_at = NOW()`);
  
      values.push(id);
  
      const sql = `
          UPDATE downloads 
          SET ${fields.join(', ')} 
          WHERE id = ?
      `;
  
      await pool.execute(sql, values);
  
      return this.findById(id);
    },
  
    async deleteById(id) {
      try{
        const file = await this.findById(id)
        await pool.execute('DELETE FROM downloads WHERE id = ?', [id]);
        return file;
      }catch(exception){
        throw(exception)
      }
    },

    // async deleteBySectionAndKey(section, key) {
    //   const existing = await this.findBySectionAndKey(section, key);
    //   if (existing) {
    //     return this.delete(existing.id);
    //   }
    //   return null;
    // }
  }
};

module.exports = {
  pool,
  testConnection,
  disconnect,
  db
};
