import mysql.connector
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Aradhya@18042024",
    database="booking_system_db"
)
cursor = conn.cursor()
def update_image(image_path, record_id):
    # Open the image file in binary mode
    with open(image_path, 'rb') as file:
        image_data = file.read()  # Read the binary image data
    # SQL query to update the image where id = record_id
    query = """UPDATE properties
               SET image = %s 
               WHERE id = %s"""
    # Values to update (image binary data and record id)
    values = (image_data, record_id)
    try:
        # Execute the SQL query to update the image
        cursor.execute(query, values)
        # Commit the transaction to the database
        conn.commit()
        print(f"Image successfully updated for record with id = {record_id}!")
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        conn.rollback()
image_path = "C:/Users/aradh/Downloads/seasideVillaLA.jpg"
record_id = 6
update_image(image_path, record_id)
cursor.close()
conn.close()