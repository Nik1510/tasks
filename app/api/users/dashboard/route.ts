import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/app/dbConfig/dbConfig";
import UserTasks from "@/app/models/userTasks";
import { getDataFromToken } from "@/app/helpers/getDataFromToken";

connect();

//  Create Task
export async function POST(request: NextRequest) {
  try {
    const { title, priority, status } = await request.json();

    // Extract userId from token using helper
    const userId = getDataFromToken(request);

    // Create new task
    const newTask = await UserTasks.create({
      user: userId,
      title,
      priority,
      status,
    });

    return NextResponse.json(
      { message: "Task created successfully", task: newTask },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error while creating task:", error);
    return NextResponse.json(
      { message: "Error creating task", error: error.message },
      { status: 500 }
    );
  }
}

//  Get All Tasks
export async function GET(request: NextRequest) {
  try {
    const userId = getDataFromToken(request);

    const tasks = await UserTasks.find({ user: userId }).sort({ createdAt: -1 });

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { message: "Unable to fetch tasks", error: error.message },
      { status: 500 }
    );
  }
}

//  Update Task
export async function PUT(request: NextRequest) {
  try {
    const { taskId, title, priority, status } = await request.json();

    if (!taskId) {
      return NextResponse.json(
        { message: "Task ID is required" },
        { status: 400 }
      );
    }

    const userId = getDataFromToken(request);

    //  Use _id, not id
    const updatedTask = await UserTasks.findOneAndUpdate(
      { _id: taskId, user: userId },
      { title, priority, status },
      { new: true }
    );

    if (!updatedTask) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Task updated successfully", task: updatedTask },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { message: "Unable to update task", error: error.message },
      { status: 500 }
    );
  }
}

//  Delete Task
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get("taskId");

    if (!taskId) {
      return NextResponse.json({ message: "Task ID required" }, { status: 400 });
    }

    const userId = getDataFromToken(request);

    const deletedTask = await UserTasks.findOneAndDelete({
      _id: taskId,
      user: userId,
    });

    if (!deletedTask) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Task deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { message: "Unable to delete task", error: error.message },
      { status: 500 }
    );
  }
}
