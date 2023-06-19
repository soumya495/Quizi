import Group from "../models/Group.js";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// @desc   Create New Group
// route   POST /api/group/create
// access  Private
const createGroup = async (req, res) => {
  const { groupName, groupDescription } = req.body;
  const groupAdmin = req.user._id;
  try {
    const group = await Group.create({
      groupName,
      groupDescription,
      groupAdmin,
    });
    return res.status(201).json({
      success: true,
      message: "Group created successfully",
      group,
    });
  } catch (error) {
    console.log("Error in creating group: ", error);
    return res.status(500).json({
      success: false,
      message: "Unable to create group",
    });
  }
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// @desc   Get Group Details
// route   Get /api/group/:groupId
// access  Private
const getGroupDetails = async (req, res) => {
  const { groupId } = req.params;

  const userId = req.user._id;

  try {
    const group = await Group.findById(groupId);
    // Checking if group exists
    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }
    // Checking if user is authorized to view group details
    if (
      userId.toString() === group.groupAdmin.toString() ||
      group.groupMembers.includes(userId)
    ) {
      return res.status(200).json({
        success: true,
        message: "Group details fetched successfully",
        group,
      });
    }

    return res.status(403).json({
      success: false,
      message: "You are not authorized to view this group",
    });
  } catch (error) {
    console.log("Error in fetching group details: ", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch group details",
    });
  }
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// @desc   Request to Join Group
// route   POST /api/group/join
// access  Private
const requestJoinGroup = async (req, res) => {
  const { joiningLink } = req.body;
  const userId = req.user._id;

  try {
    const group = await Group.findOne({ joiningLink });
    // Checking if group exists
    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }
    // Checking if user is already a member of the group
    if (
      group.groupAdmin.toString() === userId ||
      group.groupMembers.includes(userId)
    ) {
      return res.status(400).json({
        success: false,
        message: "You are already a member of this group",
      });
    }
    // Checking if user has already requested to join the group
    if (group.requestedMembers.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "You have already requested to join this group",
      });
    }
    // Adding user to requestedMembers array
    group.requestedMembers.push(userId);
    await group.save();
    return res.status(200).json({
      success: true,
      message: "Request sent successfully",
    });
  } catch (error) {
    console.log("Error in requesting to join group: ", error);
    return res.status(500).json({
      success: false,
      message: "Unable to request to join group",
    });
  }
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// @desc   Accept Join Group
// route   POST /api/group/accept
// access  Private
const acceptJoinGroup = async (req, res) => {
  const { groupId, userId } = req.body;
  const adminId = req.user._id;

  try {
    const group = await Group.findById(groupId);
    // Checking if group exists
    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }
    // Checking if the request is only accepted by the admin
    if (adminId.toString() !== group.groupAdmin.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to accept join requests",
      });
    }
    // Checking if the requested user is valid
    if (group.requestedMembers.includes(userId)) {
      // Removing user from requestedMembers array
      group.requestedMembers = group.requestedMembers.filter(
        (memberId) => memberId.toString() !== userId.toString()
      );
      // Adding user to groupMembers array
      group.groupMembers.unshift(userId);
      // @Todo - Send notification email to the user
      await group.save();
      return res.status(200).json({
        success: true,
        message: "User added to group successfully",
      });
    }
    return res.status(400).json({
      success: false,
      message: "Invalid user",
    });
  } catch (error) {
    console.log("Error in accepting join request: ", error);
    return res.status(500).json({
      success: false,
      message: "Unable to accept join request",
    });
  }
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// @desc   Reject Join Group
// route   POST /api/group/reject
// access  Private
const rejectJoinGroup = async (req, res) => {
  const { groupId, userId } = req.body;
  const adminId = req.user._id;

  try {
    const group = await Group.findById(groupId);
    // Checking if group exists
    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }
    // Checking if the request is only accepted by the admin
    if (adminId.toString() !== group.groupAdmin.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to reject join requests",
      });
    }
    // Checking if the requested user is valid
    if (group.requestedMembers.includes(userId)) {
      // Removing user from requestedMembers array
      group.requestedMembers = group.requestedMembers.filter(
        (memberId) => memberId.toString() !== userId.toString()
      );
      // @Todo - Send notification email to the user
      await group.save();
      return res.status(200).json({
        success: true,
        message: "User rejected successfully",
      });
    }
    return res.status(400).json({
      success: false,
      message: "Invalid user",
    });
  } catch (error) {
    console.log("Error in accepting join request: ", error);
    return res.status(500).json({
      success: false,
      message: "Unable to accept join request",
    });
  }
};

export {
  createGroup,
  requestJoinGroup,
  acceptJoinGroup,
  rejectJoinGroup,
  getGroupDetails,
};
