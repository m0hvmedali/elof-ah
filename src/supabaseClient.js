// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pawwqdaiucbvohsgmtop.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhd3dxZGFpdWNidm9oc2dtdG9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMTQ5MDgsImV4cCI6MjA3ODc5MDkwOH0.EuNNd8Cj9TBxJvmPARhhR1J1KPwoS3X46msX-MhriRk';

export const supabase = createClient(supabaseUrl, supabaseKey);
