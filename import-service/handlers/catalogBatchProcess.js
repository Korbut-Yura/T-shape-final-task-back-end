const AWS = require('aws-sdk')
const { Client } = require('pg')

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env

const dbOptions = {
  host: PG_HOST,
  port: PG_PORT,
  database: PG_DATABASE,
  user: PG_USERNAME,
  password: PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 5000
}

module.exports.catalogBatchProcess = async (event) => {
    const client = new Client(dbOptions);
    const sns = new AWS.SNS({ region: 'eu-west-1' })
    await client.connect()

    try {
        const products = await Promise.all(
            event.Records.map(({body})=> {
            const { title, description, price, photourl, count} = JSON.parse(body);

            return client.query(`
            WITH first_insert AS (
              INSERT INTO products (title, description, price, photourl)
              VALUES ($$${title}$$, $$${description}$$, '${price}', '${photourl}')
              RETURNING id 
            )
            INSERT INTO stocks (product_id, count)
            SELECT id, '${count}'
            FROM first_insert
          `)
        })
    )

    const params = {
        Subject: "New products have added",
        Message: JSON.stringify(products),
        TopicArn: process.env.SNS_ARN
    }
 
    await sns.publish(params).promise()
    } catch (error) {
        console.error(error)
    } finally {
        client.end()
    }
}