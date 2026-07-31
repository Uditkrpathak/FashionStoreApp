import StoreConfig from '../models/StoreConfig.js';
import AuditLog from '../models/AuditLog.js';

export const getStoreConfig = async (req, res) => {
  try {
    let config = await StoreConfig.findOne();
    if (!config) {
      config = await StoreConfig.create({});
    }
    res.json({ success: true, config });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateStoreConfig = async (req, res) => {
  try {
    const adminId = req.headers['x-user-id'] || 'system';
    const adminRole = req.headers['x-user-role'] || 'super_admin';

    let config = await StoreConfig.findOne();
    if (!config) {
      config = new StoreConfig({});
    }

    const beforeState = config.toObject();
    const updates = req.body;

    if (updates.storeName) config.storeName = updates.storeName;
    if (updates.supportEmail) config.supportEmail = updates.supportEmail;
    if (updates.supportPhone) config.supportPhone = updates.supportPhone;
    if (updates.taxRatePercent !== undefined) config.taxRatePercent = Number(updates.taxRatePercent);
    if (updates.flatShippingFee !== undefined) config.flatShippingFee = Number(updates.flatShippingFee);
    if (updates.freeShippingThreshold !== undefined) config.freeShippingThreshold = Number(updates.freeShippingThreshold);

    if (updates.featureToggles) {
      config.featureToggles = {
        ...config.featureToggles,
        ...updates.featureToggles
      };
    }

    config.version += 1;
    await config.save();

    // Tamper-Evident Audit Event
    await AuditLog.create({
      adminId,
      actorRole: adminRole,
      action: 'UPDATE_STORE_CONFIG',
      targetEntity: 'StoreConfig',
      targetId: config._id.toString(),
      before: beforeState,
      after: config.toObject(),
      details: { version: config.version }
    });

    res.json({ success: true, message: 'Store configuration updated successfully', config });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const verifyAuditLogIntegrity = async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: 1 });
    let isTampered = false;
    let corruptedIndex = -1;

    for (let i = 0; i < logs.length; i++) {
      const current = logs[i];
      if (i > 0) {
        const previous = logs[i - 1];
        if (current.previousHash !== previous.hash) {
          isTampered = true;
          corruptedIndex = i;
          break;
        }
      }
    }

    res.json({
      success: true,
      totalLogsVerified: logs.length,
      isTampered,
      corruptedIndex: isTampered ? corruptedIndex : null,
      statusMessage: isTampered
        ? `⚠️ Tamper detected at log record index ${corruptedIndex}`
        : `✅ All ${logs.length} Audit Log records verified unbroken SHA-256 hash chain.`
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
