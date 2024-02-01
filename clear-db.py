from app import db, Favorite

# db.session.query(Favorite).delete()
# db.session.commit()

table_name = Favorite.__tablename__

print(f"Name: {table_name}")