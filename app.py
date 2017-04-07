from flask import Flask, jsonify, json
import decimal
from flaskext.mysql import MySQL
from flask import request

app = Flask(__name__)

class MyJSONEncoder(json.JSONEncoder):

    def default(self, obj):
        if isinstance(obj, decimal.Decimal):
            # Convert decimal instances to strings.
            return str(obj)
        return super(MyJSONEncoder, self).default(obj)

app.json_encoder = MyJSONEncoder

mysql = MySQL()
# MySQL configurations
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'root'
app.config['MYSQL_DATABASE_DB'] = 'NYSE'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql.init_app(app)

@app.route('/database-api/portfolios', methods=['GET'])
def getPortfolios():
    cursor = mysql.connect().cursor()
    cursor.execute("SELECT * FROM portfolios")
    return jsonify(data=cursor.fetchall())

@app.route('/database-api/portfolios', methods=['POST'])
def saveToPortfolio():
    data = request.get_json()
    print data['symbol']
    connection = mysql.connect()
    cursor = connection.cursor()
    try:
        cursor.execute("SELECT count(*) FROM portfolios")
        cnt = cursor.fetchone()[0]
        print cnt
        if cnt < 5  :
            cursor.execute("INSERT INTO portfolios (Name, no_of_shares, previous_rate) values ('" + data['symbol']
                           + "'," + str(data['no_of_shares']) + "," + str(data['last_price']) + ")")
            connection.commit()
        else:
            return "MORE THAN 5!"
        return "SUCCESS: " + request.data
    except Exception as e:
        print str(e)
        return "FAILURE"
    finally:
        if connection is not None:
            connection.close()


@app.route('/database-api/portfolios', methods=['DELETE'])
def deleteFromPortfolio():
    data = request.get_json()
    symbol = data['symbol']
    print "symbol to be deleted is " + symbol
    connection = mysql.connect()
    cursor = connection.cursor()
    try:
        cursor.execute("DELETE FROM portfolios where Name=" + "'"+symbol+"'")
        connection.commit()
        return "SUCCESS"
    except Exception as e:
        print str(e)
        return "FAILURE"
    finally:
        if connection is not None:
            connection.close()






if __name__ == '__main__':
    app.run()
