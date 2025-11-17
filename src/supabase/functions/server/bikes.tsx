import { Hono } from 'npm:hono';
import * as kv from './kv_store.tsx';

export const bikesRouter = new Hono();

// Sample bike data structure
interface Bike {
  id: string;
  name: string;
  type: string;
  price: number;
  description: string;
  image: string;
}

// GET /bikes - Fetch all bikes
bikesRouter.get('/', async (c) => {
  try {
    // Try to get bikes from KV store
    const bikes = await kv.get('bikes');
    
    if (bikes) {
      return c.json({ bikes: JSON.parse(bikes) });
    }
    
    // If no bikes in store, return sample data and optionally save it
    const sampleBikes: Bike[] = [
      {
        id: '1',
        name: 'Mountain Pro X1',
        type: 'Mountain Bike',
        price: 1299,
        description: 'Professional mountain bike with full suspension and premium components.',
        image: 'https://images.unsplash.com/photo-1604677657548-4ced0c4f40c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGJpa2UlMjB0cmFpbHxlbnwxfHx8fDE3NjMzMTYzOTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      },
      {
        id: '2',
        name: 'City Cruiser 500',
        type: 'City Bike',
        price: 699,
        description: 'Comfortable city bike perfect for urban commuting and leisure rides.',
        image: 'https://images.unsplash.com/photo-1657417042847-ca485c43afbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwYmljeWNsZSUyMHNob3B8ZW58MXx8fHwxNzYzMzM2MjkwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      },
      {
        id: '3',
        name: 'Road Racer Elite',
        type: 'Road Bike',
        price: 1899,
        description: 'Lightweight road bike designed for speed and long-distance cycling.',
        image: 'https://images.unsplash.com/photo-1681295691087-77bdf1d59f9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWNsaW5nJTIwcm9hZCUyMGJpa2V8ZW58MXx8fHwxNzYzMzM2MjkwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      },
      {
        id: '4',
        name: 'Hybrid Explorer',
        type: 'Hybrid Bike',
        price: 899,
        description: 'Versatile hybrid bike for both city streets and light trails.',
        image: 'https://images.unsplash.com/photo-1657417042847-ca485c43afbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwYmljeWNsZSUyMHNob3B8ZW58MXx8fHwxNzYzMzM2MjkwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      },
    ];
    
    // Save sample data to KV store for future requests
    await kv.set('bikes', JSON.stringify(sampleBikes));
    
    return c.json({ bikes: sampleBikes });
  } catch (error) {
    console.error('Error fetching bikes from KV store:', error);
    return c.json({ error: 'Failed to fetch bikes' }, 500);
  }
});

// POST /bikes - Add a new bike
bikesRouter.post('/', async (c) => {
  try {
    const newBike: Bike = await c.req.json();
    
    // Get existing bikes
    const existingBikes = await kv.get('bikes');
    const bikes: Bike[] = existingBikes ? JSON.parse(existingBikes) : [];
    
    // Add new bike
    bikes.push(newBike);
    
    // Save updated bikes
    await kv.set('bikes', JSON.stringify(bikes));
    
    return c.json({ success: true, bike: newBike }, 201);
  } catch (error) {
    console.error('Error adding bike to KV store:', error);
    return c.json({ error: 'Failed to add bike' }, 500);
  }
});

// PUT /bikes/:id - Update a bike
bikesRouter.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const updatedBike: Bike = await c.req.json();
    
    // Get existing bikes
    const existingBikes = await kv.get('bikes');
    if (!existingBikes) {
      return c.json({ error: 'No bikes found' }, 404);
    }
    
    const bikes: Bike[] = JSON.parse(existingBikes);
    const index = bikes.findIndex(bike => bike.id === id);
    
    if (index === -1) {
      return c.json({ error: 'Bike not found' }, 404);
    }
    
    bikes[index] = { ...bikes[index], ...updatedBike, id };
    
    // Save updated bikes
    await kv.set('bikes', JSON.stringify(bikes));
    
    return c.json({ success: true, bike: bikes[index] });
  } catch (error) {
    console.error('Error updating bike in KV store:', error);
    return c.json({ error: 'Failed to update bike' }, 500);
  }
});

// DELETE /bikes/:id - Delete a bike
bikesRouter.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    // Get existing bikes
    const existingBikes = await kv.get('bikes');
    if (!existingBikes) {
      return c.json({ error: 'No bikes found' }, 404);
    }
    
    const bikes: Bike[] = JSON.parse(existingBikes);
    const filteredBikes = bikes.filter(bike => bike.id !== id);
    
    if (bikes.length === filteredBikes.length) {
      return c.json({ error: 'Bike not found' }, 404);
    }
    
    // Save updated bikes
    await kv.set('bikes', JSON.stringify(filteredBikes));
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting bike from KV store:', error);
    return c.json({ error: 'Failed to delete bike' }, 500);
  }
});
