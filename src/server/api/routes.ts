import express from 'express';
import { sheetsService } from './sheets';
import { RsvpData } from './types';

const router = express.Router();

// Get RSVP data by invite code
router.get('/rsvp/:inviteCode', async (req, res) => {
  try {
    const { inviteCode } = req.params;
    const rsvpData = await sheetsService.getRsvpByInviteCode(inviteCode);
    
    if (!rsvpData) {
      return res.status(404).json({ error: 'Invite code not found' });
    }

    res.json(rsvpData);
  } catch (error) {
    console.error('Error fetching RSVP:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit RSVP response
router.post('/rsvp/:inviteCode', async (req, res) => {
  try {
    const { inviteCode } = req.params;
    const existingRsvp = await sheetsService.getRsvpByInviteCode(inviteCode);
    
    if (!existingRsvp) {
      return res.status(404).json({ error: 'Invite code not found' });
    }

    const updatedRsvp: RsvpData = {
      ...existingRsvp,
      response: {
        ...req.body,
        submittedAt: new Date().toISOString(),
      },
    };

    const success = await sheetsService.saveRsvpResponse(updatedRsvp);
    
    if (!success) {
      return res.status(500).json({ error: 'Failed to save RSVP' });
    }

    res.json(updatedRsvp);
  } catch (error) {
    console.error('Error saving RSVP:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;