import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { action, key, value, existingId } = body;

    if (action === 'list') {
      const settings = await base44.asServiceRole.entities.AdminSettings.filter({});
      return Response.json(settings);
    }

    if (action === 'save') {
      if (existingId) {
        const updated = await base44.asServiceRole.entities.AdminSettings.update(existingId, { setting_value: value });
        return Response.json(updated);
      } else {
        const created = await base44.asServiceRole.entities.AdminSettings.create({
          setting_key: key,
          setting_value: value,
          setting_type: 'text',
        });
        return Response.json(created);
      }
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});