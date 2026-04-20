from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Optional
from database import SessionLocal, engine
import models
import schemas

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configure CORS to allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins= ["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"] 
)

def get_db():
    """

    Provide a database session for each request.

    Yields:
        Session: Active SQLAlchemy session
    
    Notes:
        The session is automatically closed after the request completes.

    """

    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/tasks", response_model=list[schemas.TaskResponse])
def get_tasks(status: Optional[str] = None, db: Session = Depends(get_db)):
    """

    Retrieve all tasks from database.

    Args:
        status: (Optional[str]): Filter tasks by status.
    
    Returns:
        list[schemas.TaskResponse]: List of tasks,

    """

    if status:
        return db.query(models.Task).filter(models.Task.status == status).all()
    
    return db.query(models.Task).all()

@app.get("/tasks/{task_id}", response_model=schemas.TaskResponse)
def get_task(task_id: int, db: Session = Depends(get_db)):
    """

    Returns a single task by its ID.
    Raises a 404 error if no task with that ID exists.

    """

    task = db.query(models.Task).filter(models.Task.id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found")
    
    return task

@app.post("/tasks", response_model=schemas.TaskResponse)
def create_task(task_data: schemas.TaskCreate, db: Session = Depends(get_db)):
    """

    Create a new task.

    Args:
        task_data (schemas.TaskCreate): Task data from the request body.
        db (Session): Database session dependency.
    
    Returns:
        schemas.TaskResponse: The newly created task.

    """
    new_task = models.Task(
        description=task_data.description,
        status=task_data.status
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task

@app.put("/tasks/{task_id}", response_model=schemas.TaskResponse)
def update_task(task_id: int, task_data: schemas.TaskUpdate, db: Session = Depends(get_db)):
    """

    Update an existing task.

    Args:
        (task_id: int): Unique identifier of the task.
        (task_data: schemas.TaskUpdate): Fields to update.
        db (Session): Database session dependency.
    
    Returns:
        schemas.TaskResponse: The updated task.
    
    Raises:
        HTTPException: If the task is not found or status is invalid.

    """

    task = db.query(models.Task).filter(models.Task.id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found")
    
    if task_data.description is not None:
        task.description = task_data.description
    
    if task_data.status is not None:
        if task_data.status not in ("todo", "in-progress", "done"):
            raise HTTPException(status_code=400, detail="Invalid status")
        task.status = task_data.status
    
    db.commit()
    db.refresh(task)

    return task

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    """

    Delete a task by its ID.

    Args:
        task_id (int): Unique identifier of the task.
        db (Session): Database session dependency.
    
    Returns:
        dict: Confirmation message.
    
    Raises:
        HTTPException: If the task is not found

    """

    task = db.query(models.Task).filter(models.Task.id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found")
    
    db.delete(task)
    db.commit()

    return {"message": f"Task {task_id} deleted"}