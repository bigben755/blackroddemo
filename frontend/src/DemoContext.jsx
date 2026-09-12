import React from "react";
import { createSeedState, STORAGE_KEY, uid } from "./demoData";

const DemoContext = React.createContext(null);

const loadInitial = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.version === 1) return parsed;
    }
  } catch {
    // Fall back to a clean seed state.
  }
  return createSeedState();
};

export function DemoProvider({ children }) {
  const [state, setState] = React.useState(loadInitial);

  React.useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const updateConfig = (patch) => {
    setState((current) => ({
      ...current,
      config: { ...current.config, ...patch },
    }));
  };

  const completeSetup = (siteName) => {
    const clean = String(siteName || "").trim() || "Your Community Now";
    setState((current) => ({
      ...current,
      config: {
        ...current.config,
        siteName: clean,
        setupComplete: true,
      },
    }));
  };

  const resetDemo = () => {
    const siteName = state.config?.siteName || "Your Community Now";
    const next = createSeedState(siteName);
    next.config.setupComplete = true;
    setState(next);
  };

  const startOver = () => {
    setState(createSeedState());
  };

  const addEvent = (payload) => {
    setState((current) => ({
      ...current,
      events: [
        ...current.events,
        {
          id: uid("evt"),
          featured: false,
          status: "published",
          ...payload,
        },
      ],
    }));
  };

  const updateEvent = (id, patch) => {
    setState((current) => ({
      ...current,
      events: current.events.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
  };

  const deleteEvent = (id) => {
    setState((current) => ({
      ...current,
      events: current.events.filter((item) => item.id !== id),
      savedEventIds: current.savedEventIds.filter((value) => value !== id),
    }));
  };

  const addOrganisation = (payload) => {
    setState((current) => ({
      ...current,
      organisations: [
        ...current.organisations,
        {
          id: uid("org"),
          claimed: false,
          admins: [],
          email: "demo@example.invalid",
          phone: "",
          website: "https://example.invalid",
          ...payload,
        },
      ],
    }));
  };

  const updateOrganisation = (id, patch) => {
    setState((current) => ({
      ...current,
      organisations: current.organisations.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
  };

  const deleteOrganisation = (id) => {
    setState((current) => ({
      ...current,
      organisations: current.organisations.filter((item) => item.id !== id),
      events: current.events.filter((item) => item.orgId !== id),
      volunteering: current.volunteering.filter((item) => item.orgId !== id),
      feed: current.feed.filter((item) => item.orgId !== id),
    }));
  };

  const addVenue = (payload) => {
    setState((current) => ({
      ...current,
      venues: [...current.venues, { id: uid("venue"), facilities: [], capacity: null, ...payload }],
    }));
  };

  const updateVenue = (id, patch) => {
    setState((current) => ({
      ...current,
      venues: current.venues.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
  };

  const deleteVenue = (id) => {
    setState((current) => ({
      ...current,
      venues: current.venues.filter((item) => item.id !== id),
      events: current.events.map((item) => (item.venueId === id ? { ...item, venueId: "" } : item)),
    }));
  };

  const addVolunteer = (payload) => {
    setState((current) => ({
      ...current,
      volunteering: [...current.volunteering, { id: uid("vol"), ...payload }],
    }));
  };

  const updateVolunteer = (id, patch) => {
    setState((current) => ({
      ...current,
      volunteering: current.volunteering.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
  };

  const deleteVolunteer = (id) => {
    setState((current) => ({
      ...current,
      volunteering: current.volunteering.filter((item) => item.id !== id),
    }));
  };

  const addFeedPost = (payload) => {
    setState((current) => ({
      ...current,
      feed: [
        {
          id: uid("feed"),
          createdAt: new Date().toISOString(),
          likes: 0,
          ...payload,
        },
        ...current.feed,
      ],
    }));
  };

  const deleteFeedPost = (id) => {
    setState((current) => ({
      ...current,
      feed: current.feed.filter((item) => item.id !== id),
    }));
  };

  const likeFeedPost = (id) => {
    setState((current) => ({
      ...current,
      feed: current.feed.map((item) => (item.id === id ? { ...item, likes: Number(item.likes || 0) + 1 } : item)),
    }));
  };

  const toggleSavedEvent = (id) => {
    setState((current) => {
      const exists = current.savedEventIds.includes(id);
      return {
        ...current,
        savedEventIds: exists
          ? current.savedEventIds.filter((value) => value !== id)
          : [...current.savedEventIds, id],
      };
    });
  };

  const markNotificationsRead = () => {
    setState((current) => ({
      ...current,
      notifications: current.notifications.map((item) => ({ ...item, read: true })),
    }));
  };

  const value = {
    state,
    updateConfig,
    completeSetup,
    resetDemo,
    startOver,
    addEvent,
    updateEvent,
    deleteEvent,
    addOrganisation,
    updateOrganisation,
    deleteOrganisation,
    addVenue,
    updateVenue,
    deleteVenue,
    addVolunteer,
    updateVolunteer,
    deleteVolunteer,
    addFeedPost,
    deleteFeedPost,
    likeFeedPost,
    toggleSavedEvent,
    markNotificationsRead,
  };

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const context = React.useContext(DemoContext);
  if (!context) throw new Error("useDemo must be used inside DemoProvider");
  return context;
}
