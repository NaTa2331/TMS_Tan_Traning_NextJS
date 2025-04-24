import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'app', 'api', 'listitem', 'data.json');

interface ListItem {
  id: number;
  title: string;
  description: string;
}

interface ListData {
  items: ListItem[];
}

async function readData(): Promise<ListData> {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    const parsedData = JSON.parse(data);
    
    // If the data is just an array, wrap it in an items object
    if (Array.isArray(parsedData)) {
      return { items: parsedData };
    }
    
    return parsedData;
  } catch (error) {
    console.error('Error reading data:', error);
    return { items: [] };
  }
}

async function writeData(data: ListData) {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
}

export async function GET(request: NextRequest) {
  try {
    const data = await readData();
    const items = data.items || [];
    
    const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '9');
    const offset = (page - 1) * limit;
    const search = request.nextUrl.searchParams.get('search') || '';
    
    const filteredItems = items.filter((item: ListItem) => 
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
    );
    
    const paginatedItems = filteredItems.slice(offset, offset + limit);
    const response = NextResponse.json(paginatedItems);
    response.headers.set('X-Total-Count', filteredItems.length.toString());
    
    return response;
  } catch (error) {
    console.error('Error in GET request:', error);
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await readData();
    const items = data.items || [];
    
    const newItem = await request.json();
    const id = Math.max(...items.map((item: ListItem) => item.id), 0) + 1;
    const item: ListItem = {
      id,
      ...newItem
    };
    
    items.push(item);
    await writeData({ items });
    
    return NextResponse.json(item);
  } catch (error) {
    console.error('Error in POST request:', error);
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await readData();
    const items = data.items || [];
    
    const { id, ...updates } = await request.json();
    const index = items.findIndex((item: ListItem) => item.id === id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    
    items[index] = { ...items[index], ...updates };
    await writeData({ items });
    
    return NextResponse.json(items[index]);
  } catch (error) {
    console.error('Error in PUT request:', error);
    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const data = await readData();
    const items = data.items || [];
    
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '0');
    const index = items.findIndex((item: ListItem) => item.id === id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    
    items.splice(index, 1);
    await writeData({ items });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE request:', error);
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    );
  }
}