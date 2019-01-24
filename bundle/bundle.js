var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var pixi_heaven;
(function (pixi_heaven) {
    var Resource = PIXI.loaders.Resource;
    function atlasChecker() {
        return function (resource, next) {
            var atlas = resource.metadata.runtimeAtlas;
            if (!atlas) {
                return next();
            }
            if (resource.type === Resource.TYPE.IMAGE) {
                if (resource.texture) {
                    resource.texture = atlas.add(resource.texture, true);
                }
                return next();
            }
            if (resource.type === Resource.TYPE.JSON &&
                resource.spritesheet) {
                resource.spritesheet.textures = atlas.addHash(resource.spritesheet.textures, true);
                resource.textures = resource.spritesheet.textures;
                return next();
            }
            next();
        };
    }
    pixi_heaven.atlasChecker = atlasChecker;
    PIXI.loaders.Loader.addPixiMiddleware(atlasChecker);
    PIXI.loader.use(atlasChecker());
})(pixi_heaven || (pixi_heaven = {}));
var pixi_heaven;
(function (pixi_heaven) {
    var utils;
    (function (utils) {
        function createIndicesForQuads(size) {
            var totalIndices = size * 6;
            var indices = new Uint16Array(totalIndices);
            for (var i = 0, j = 0; i < totalIndices; i += 6, j += 4) {
                indices[i + 0] = j + 0;
                indices[i + 1] = j + 1;
                indices[i + 2] = j + 2;
                indices[i + 3] = j + 0;
                indices[i + 4] = j + 2;
                indices[i + 5] = j + 3;
            }
            return indices;
        }
        utils.createIndicesForQuads = createIndicesForQuads;
        function isPow2(v) {
            return !(v & (v - 1)) && (!!v);
        }
        utils.isPow2 = isPow2;
        function nextPow2(v) {
            v += +(v === 0);
            --v;
            v |= v >>> 1;
            v |= v >>> 2;
            v |= v >>> 4;
            v |= v >>> 8;
            v |= v >>> 16;
            return v + 1;
        }
        utils.nextPow2 = nextPow2;
        function log2(v) {
            var r, shift;
            r = +(v > 0xFFFF) << 4;
            v >>>= r;
            shift = +(v > 0xFF) << 3;
            v >>>= shift;
            r |= shift;
            shift = +(v > 0xF) << 2;
            v >>>= shift;
            r |= shift;
            shift = +(v > 0x3) << 1;
            v >>>= shift;
            r |= shift;
            return r | (v >> 1);
        }
        utils.log2 = log2;
    })(utils = pixi_heaven.utils || (pixi_heaven.utils = {}));
})(pixi_heaven || (pixi_heaven = {}));
PIXI.heaven = pixi_heaven;
var pixi_heaven;
(function (pixi_heaven) {
    var Rectangle = PIXI.Rectangle;
    var INF = 1 << 20;
    var AtlasNode = (function () {
        function AtlasNode() {
            this.childs = [];
            this.rect = new Rectangle(0, 0, INF, INF);
            this.data = null;
        }
        AtlasNode.prototype.insert = function (atlasWidth, atlasHeight, width, height, data) {
            if (this.childs.length > 0) {
                var newNode = this.childs[0].insert(atlasWidth, atlasHeight, width, height, data);
                if (newNode != null) {
                    return newNode;
                }
                return this.childs[1].insert(atlasWidth, atlasHeight, width, height, data);
            }
            else {
                var rect = this.rect;
                if (this.data != null)
                    return null;
                var w = Math.min(rect.width, atlasWidth - rect.x);
                if (width > rect.width ||
                    width > atlasWidth - rect.x ||
                    height > rect.height ||
                    height > atlasHeight - rect.y)
                    return null;
                if (width == rect.width && height == rect.height) {
                    this.data = data;
                    return this;
                }
                this.childs.push(new AtlasNode());
                this.childs.push(new AtlasNode());
                var dw = rect.width - width;
                var dh = rect.height - height;
                if (dw > dh) {
                    this.childs[0].rect = new Rectangle(rect.x, rect.y, width, rect.height);
                    this.childs[1].rect = new Rectangle(rect.x + width, rect.y, rect.width - width, rect.height);
                }
                else {
                    this.childs[0].rect = new Rectangle(rect.x, rect.y, rect.width, height);
                    this.childs[1].rect = new Rectangle(rect.x, rect.y + height, rect.width, rect.height - height);
                }
                return this.childs[0].insert(atlasWidth, atlasHeight, width, height, data);
            }
        };
        return AtlasNode;
    }());
    pixi_heaven.AtlasNode = AtlasNode;
})(pixi_heaven || (pixi_heaven = {}));
var pixi_heaven;
(function (pixi_heaven) {
    var AtlasEntry = (function () {
        function AtlasEntry(atlas, baseTexture) {
            this.nodeUpdateID = 0;
            this.regions = [];
            this.baseTexture = baseTexture;
            this.width = baseTexture.width;
            this.height = baseTexture.height;
            this.atlas = atlas;
        }
        return AtlasEntry;
    }());
    pixi_heaven.AtlasEntry = AtlasEntry;
})(pixi_heaven || (pixi_heaven = {}));
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var pixi_heaven;
(function (pixi_heaven) {
    var Texture = PIXI.Texture;
    var Rectangle = PIXI.Rectangle;
    var TextureRegion = (function (_super) {
        __extends(TextureRegion, _super);
        function TextureRegion(entry, texture) {
            if (texture === void 0) {
                texture = new Texture(entry.baseTexture);
            }
            var _this = _super.call(this, entry.currentAtlas ? entry.currentAtlas.baseTexture : texture.baseTexture, entry.currentNode ? new Rectangle(texture.frame.x + entry.currentNode.rect.x, texture.frame.y + entry.currentNode.rect.y, texture.frame.width, texture.frame.height) : texture.frame.clone(), texture.orig, texture.trim, texture.rotate) || this;
            _this.uid = PIXI.utils.uid();
            _this.proxied = texture;
            _this.entry = entry;
            return _this;
        }
        TextureRegion.prototype.updateFrame = function () {
            var texture = this.proxied;
            var entry = this.entry;
            var frame = this._frame;
            if (entry.currentNode) {
                this.baseTexture = entry.currentAtlas.baseTexture;
                frame.x = texture.frame.x + entry.currentNode.rect.x;
                frame.y = texture.frame.y + entry.currentNode.rect.y;
            }
            else {
                this.baseTexture = texture.baseTexture;
                frame.x = texture.frame.x;
                frame.y = texture.frame.y;
            }
            frame.width = texture.frame.width;
            frame.height = texture.frame.height;
            this._updateUvs();
        };
        return TextureRegion;
    }(PIXI.Texture));
    pixi_heaven.TextureRegion = TextureRegion;
})(pixi_heaven || (pixi_heaven = {}));
var pixi_heaven;
(function (pixi_heaven) {
    var webgl;
    (function (webgl) {
        var BatchBuffer = (function () {
            function BatchBuffer(size) {
                this.vertices = new ArrayBuffer(size);
                this.float32View = new Float32Array(this.vertices);
                this.uint32View = new Uint32Array(this.vertices);
            }
            BatchBuffer.prototype.destroy = function () {
                this.vertices = null;
            };
            return BatchBuffer;
        }());
        webgl.BatchBuffer = BatchBuffer;
    })(webgl = pixi_heaven.webgl || (pixi_heaven.webgl = {}));
})(pixi_heaven || (pixi_heaven = {}));
var pixi_heaven;
(function (pixi_heaven) {
    var webgl;
    (function (webgl) {
        function generateMultiTextureShader(vertexSrc, fragmentSrc, gl, maxTextures) {
            fragmentSrc = fragmentSrc.replace(/%count%/gi, maxTextures + '');
            fragmentSrc = fragmentSrc.replace(/%forloop%/gi, generateSampleSrc(maxTextures));
            var shader = new PIXI.Shader(gl, vertexSrc, fragmentSrc);
            var sampleValues = new Int32Array(maxTextures);
            for (var i = 0; i < maxTextures; i++) {
                sampleValues[i] = i;
            }
            shader.bind();
            shader.uniforms.uSamplers = sampleValues;
            return shader;
        }
        webgl.generateMultiTextureShader = generateMultiTextureShader;
        function generateSampleSrc(maxTextures) {
            var src = '';
            src += '\n';
            src += '\n';
            for (var i = 0; i < maxTextures; i++) {
                if (i > 0) {
                    src += '\nelse ';
                }
                if (i < maxTextures - 1) {
                    src += "if(textureId == " + i + ".0)";
                }
                src += '\n{';
                src += "\n\ttexColor = texture2D(uSamplers[" + i + "], texCoord);";
                src += '\n}';
            }
            src += '\n';
            src += '\n';
            return src;
        }
    })(webgl = pixi_heaven.webgl || (pixi_heaven.webgl = {}));
})(pixi_heaven || (pixi_heaven = {}));
var pixi_heaven;
(function (pixi_heaven) {
    var webgl;
    (function (webgl) {
        var ObjectRenderer = PIXI.ObjectRenderer;
        var settings = PIXI.settings;
        var GLBuffer = PIXI.glCore.GLBuffer;
        var premultiplyBlendMode = PIXI.utils.premultiplyBlendMode;
        var TICK = 1 << 20;
        var BatchGroup = (function () {
            function BatchGroup() {
                this.textures = [];
                this.textureCount = 0;
                this.ids = [];
                this.size = 0;
                this.start = 0;
                this.blend = PIXI.BLEND_MODES.NORMAL;
                this.uniforms = null;
            }
            return BatchGroup;
        }());
        webgl.BatchGroup = BatchGroup;
        var MultiTextureSpriteRenderer = (function (_super) {
            __extends(MultiTextureSpriteRenderer, _super);
            function MultiTextureSpriteRenderer(renderer) {
                var _this = _super.call(this, renderer) || this;
                _this.shaderVert = '';
                _this.shaderFrag = '';
                _this.MAX_TEXTURES_LOCAL = 32;
                _this.vertSize = 5;
                _this.vertByteSize = _this.vertSize * 4;
                _this.size = settings.SPRITE_BATCH_SIZE;
                _this.currentIndex = 0;
                _this.sprites = [];
                _this.vertexBuffers = [];
                _this.vaos = [];
                _this.vaoMax = 2;
                _this.vertexCount = 0;
                _this.MAX_TEXTURES = 1;
                _this.indices = pixi_heaven.utils.createIndicesForQuads(_this.size);
                _this.groups = [];
                for (var k = 0; k < _this.size; k++) {
                    _this.groups[k] = new BatchGroup();
                }
                _this.vaoMax = 2;
                _this.vertexCount = 0;
                _this.renderer.on('prerender', _this.onPrerender, _this);
                return _this;
            }
            MultiTextureSpriteRenderer.prototype.getUniforms = function (spr) {
                return null;
            };
            MultiTextureSpriteRenderer.prototype.syncUniforms = function (obj) {
                if (!obj)
                    return;
                var sh = this.shader;
                for (var key in obj) {
                    sh.uniforms[key] = obj[key];
                }
            };
            MultiTextureSpriteRenderer.prototype.genShader = function () {
                var gl = this.renderer.gl;
                this.MAX_TEXTURES = Math.min(this.MAX_TEXTURES_LOCAL, this.renderer.plugins['sprite'].MAX_TEXTURES);
                this.shader = webgl.generateMultiTextureShader(this.shaderVert, this.shaderFrag, gl, this.MAX_TEXTURES);
            };
            MultiTextureSpriteRenderer.prototype.onContextChange = function () {
                var gl = this.renderer.gl;
                this.genShader();
                this.indexBuffer = GLBuffer.createIndexBuffer(gl, this.indices, gl.STATIC_DRAW);
                this.renderer.bindVao(null);
                var attrs = this.shader.attributes;
                for (var i = 0; i < this.vaoMax; i++) {
                    var vertexBuffer = this.vertexBuffers[i] = GLBuffer.createVertexBuffer(gl, null, gl.STREAM_DRAW);
                    this.vaos[i] = this.createVao(vertexBuffer);
                }
                if (!this.buffers) {
                    this.buffers = [];
                    for (var i = 1; i <= pixi_heaven.utils.nextPow2(this.size); i *= 2) {
                        this.buffers.push(new webgl.BatchBuffer(i * 4 * this.vertByteSize));
                    }
                }
                this.vao = this.vaos[0];
            };
            MultiTextureSpriteRenderer.prototype.onPrerender = function () {
                this.vertexCount = 0;
            };
            MultiTextureSpriteRenderer.prototype.render = function (sprite) {
                if (this.currentIndex >= this.size) {
                    this.flush();
                }
                if (!sprite._texture._uvs) {
                    return;
                }
                if (!sprite._texture.baseTexture) {
                    return;
                }
                this.sprites[this.currentIndex++] = sprite;
            };
            MultiTextureSpriteRenderer.prototype.flush = function () {
                if (this.currentIndex === 0) {
                    return;
                }
                var gl = this.renderer.gl;
                var MAX_TEXTURES = this.MAX_TEXTURES;
                var np2 = pixi_heaven.utils.nextPow2(this.currentIndex);
                var log2 = pixi_heaven.utils.log2(np2);
                var buffer = this.buffers[log2];
                var sprites = this.sprites;
                var groups = this.groups;
                var float32View = buffer.float32View;
                var uint32View = buffer.uint32View;
                var index = 0;
                var nextTexture;
                var currentTexture;
                var currentUniforms = null;
                var groupCount = 1;
                var textureCount = 0;
                var currentGroup = groups[0];
                var blendMode = premultiplyBlendMode[sprites[0]._texture.baseTexture.premultipliedAlpha ? 1 : 0][sprites[0].blendMode];
                currentGroup.textureCount = 0;
                currentGroup.start = 0;
                currentGroup.blend = blendMode;
                TICK++;
                var i;
                for (i = 0; i < this.currentIndex; ++i) {
                    var sprite = sprites[i];
                    nextTexture = sprite._texture.baseTexture;
                    var spriteBlendMode = premultiplyBlendMode[Number(nextTexture.premultipliedAlpha)][sprite.blendMode];
                    if (blendMode !== spriteBlendMode) {
                        blendMode = spriteBlendMode;
                        currentTexture = null;
                        textureCount = MAX_TEXTURES;
                        TICK++;
                    }
                    var uniforms = this.getUniforms(sprite);
                    if (currentUniforms !== uniforms) {
                        currentUniforms = uniforms;
                        currentTexture = null;
                        textureCount = MAX_TEXTURES;
                        TICK++;
                    }
                    if (currentTexture !== nextTexture) {
                        currentTexture = nextTexture;
                        if (nextTexture._enabled !== TICK) {
                            if (textureCount === MAX_TEXTURES) {
                                TICK++;
                                textureCount = 0;
                                currentGroup.size = i - currentGroup.start;
                                currentGroup = groups[groupCount++];
                                currentGroup.textureCount = 0;
                                currentGroup.blend = blendMode;
                                currentGroup.start = i;
                                currentGroup.uniforms = currentUniforms;
                            }
                            nextTexture._enabled = TICK;
                            nextTexture._virtalBoundId = textureCount;
                            currentGroup.textures[currentGroup.textureCount++] = nextTexture;
                            textureCount++;
                        }
                    }
                    this.fillVertices(float32View, uint32View, index, sprite, nextTexture._virtalBoundId);
                    index += this.vertSize * 4;
                }
                currentGroup.size = i - currentGroup.start;
                if (!settings.CAN_UPLOAD_SAME_BUFFER) {
                    if (this.vaoMax <= this.vertexCount) {
                        this.vaoMax++;
                        var attrs = this.shader.attributes;
                        var vertexBuffer = this.vertexBuffers[this.vertexCount] = GLBuffer.createVertexBuffer(gl, null, gl.STREAM_DRAW);
                        this.vaos[this.vertexCount] = this.createVao(vertexBuffer);
                    }
                    this.renderer.bindVao(this.vaos[this.vertexCount]);
                    this.vertexBuffers[this.vertexCount].upload(buffer.vertices, 0, false);
                    this.vertexCount++;
                }
                else {
                    this.vertexBuffers[this.vertexCount].upload(buffer.vertices, 0, true);
                }
                currentUniforms = null;
                for (i = 0; i < groupCount; i++) {
                    var group = groups[i];
                    var groupTextureCount = group.textureCount;
                    if (group.uniforms !== currentUniforms) {
                        this.syncUniforms(group.uniforms);
                    }
                    for (var j = 0; j < groupTextureCount; j++) {
                        this.renderer.bindTexture(group.textures[j], j, true);
                        group.textures[j]._virtalBoundId = -1;
                        var v = this.shader.uniforms.samplerSize;
                        if (v) {
                            v[0] = group.textures[j].realWidth;
                            v[1] = group.textures[j].realHeight;
                            this.shader.uniforms.samplerSize = v;
                        }
                    }
                    this.renderer.state.setBlendMode(group.blend);
                    gl.drawElements(gl.TRIANGLES, group.size * 6, gl.UNSIGNED_SHORT, group.start * 6 * 2);
                }
                this.currentIndex = 0;
            };
            MultiTextureSpriteRenderer.prototype.start = function () {
                this.renderer.bindShader(this.shader);
                if (settings.CAN_UPLOAD_SAME_BUFFER) {
                    this.renderer.bindVao(this.vaos[this.vertexCount]);
                    this.vertexBuffers[this.vertexCount].bind();
                }
            };
            MultiTextureSpriteRenderer.prototype.stop = function () {
                this.flush();
            };
            MultiTextureSpriteRenderer.prototype.destroy = function () {
                for (var i = 0; i < this.vaoMax; i++) {
                    if (this.vertexBuffers[i]) {
                        this.vertexBuffers[i].destroy();
                    }
                    if (this.vaos[i]) {
                        this.vaos[i].destroy();
                    }
                }
                if (this.indexBuffer) {
                    this.indexBuffer.destroy();
                }
                this.renderer.off('prerender', this.onPrerender, this);
                _super.prototype.destroy.call(this);
                if (this.shader) {
                    this.shader.destroy();
                    this.shader = null;
                }
                this.vertexBuffers = null;
                this.vaos = null;
                this.indexBuffer = null;
                this.indices = null;
                this.sprites = null;
                for (var i = 0; i < this.buffers.length; ++i) {
                    this.buffers[i].destroy();
                }
            };
            return MultiTextureSpriteRenderer;
        }(ObjectRenderer));
        webgl.MultiTextureSpriteRenderer = MultiTextureSpriteRenderer;
    })(webgl = pixi_heaven.webgl || (pixi_heaven.webgl = {}));
})(pixi_heaven || (pixi_heaven = {}));
var pixi_heaven;
(function (pixi_heaven) {
    var AtlasManager = (function () {
        function AtlasManager(renderer) {
            var _this = this;
            this.extensions = null;
            this.onContextChange = function (gl) {
                _this.gl = gl;
                _this.renderer.textureManager.updateTexture = _this.updateTexture;
                _this.extensions = {
                    depthTexture: gl.getExtension('WEBKIT_WEBGL_depth_texture'),
                    floatTexture: gl.getExtension('OES_texture_float'),
                };
            };
            this.updateTexture = function (texture_, location) {
                var tm = _this.renderer.textureManager;
                var gl = _this.gl;
                var anyThis = _this;
                var texture = texture_.baseTexture || texture_;
                var isRenderTexture = !!texture._glRenderTargets;
                if (!texture.hasLoaded) {
                    return null;
                }
                var boundTextures = _this.renderer.boundTextures;
                if (location === undefined) {
                    location = 0;
                    for (var i = 0; i < boundTextures.length; ++i) {
                        if (boundTextures[i] === texture) {
                            location = i;
                            break;
                        }
                    }
                }
                boundTextures[location] = texture;
                gl.activeTexture(gl.TEXTURE0 + location);
                var glTexture = texture._glTextures[_this.renderer.CONTEXT_UID];
                if (!glTexture) {
                    if (isRenderTexture) {
                        var renderTarget = new PIXI.RenderTarget(_this.gl, texture.width, texture.height, texture.scaleMode, texture.resolution);
                        renderTarget.resize(texture.width, texture.height);
                        texture._glRenderTargets[_this.renderer.CONTEXT_UID] = renderTarget;
                        glTexture = renderTarget.texture;
                    }
                    else {
                        glTexture = new PIXI.glCore.GLTexture(_this.gl, null, null, null, null);
                        glTexture.bind(location);
                    }
                    texture._glTextures[_this.renderer.CONTEXT_UID] = glTexture;
                    texture.on('update', tm.updateTexture, tm);
                    texture.on('dispose', tm.destroyTexture, tm);
                }
                else if (isRenderTexture) {
                    texture._glRenderTargets[_this.renderer.CONTEXT_UID].resize(texture.width, texture.height);
                }
                glTexture.premultiplyAlpha = texture.premultipliedAlpha;
                if (!isRenderTexture) {
                    if (!texture.resource) {
                        glTexture.upload(texture.source);
                    }
                    else if (!texture.resource.onTextureUpload(_this.renderer, texture, glTexture)) {
                        glTexture.uploadData(null, texture.realWidth, texture.realHeight);
                    }
                }
                if (texture.forceUploadStyle) {
                    _this.setStyle(texture, glTexture);
                }
                glTexture._updateID = texture._updateID;
                return glTexture;
            };
            this.renderer = renderer;
            renderer.on('context', this.onContextChange);
        }
        AtlasManager.prototype.setStyle = function (texture, glTexture) {
            var gl = this.gl;
            if (texture.isPowerOfTwo) {
                if (texture.mipmap) {
                    glTexture.enableMipmap();
                }
                if (texture.wrapMode === PIXI.WRAP_MODES.CLAMP) {
                    glTexture.enableWrapClamp();
                }
                else if (texture.wrapMode === PIXI.WRAP_MODES.REPEAT) {
                    glTexture.enableWrapRepeat();
                }
                else {
                    glTexture.enableWrapMirrorRepeat();
                }
            }
            else {
                glTexture.enableWrapClamp();
            }
            if (texture.scaleMode === PIXI.SCALE_MODES.NEAREST) {
                glTexture.enableNearestScaling();
            }
            else {
                glTexture.enableLinearScaling();
            }
        };
        AtlasManager.prototype.destroy = function () {
            this.renderer.off('context', this.onContextChange);
        };
        return AtlasManager;
    }());
    pixi_heaven.AtlasManager = AtlasManager;
    PIXI.WebGLRenderer.registerPlugin('atlas', AtlasManager);
})(pixi_heaven || (pixi_heaven = {}));
var pixi_heaven;
(function (pixi_heaven) {
    PIXI.BaseTexture.prototype._updateID = 0;
    PIXI.BaseTexture.prototype.resource = null;
    PIXI.BaseTexture.prototype.forceUploadStyle = true;
    var tmpCanvas;
    PIXI.BaseTexture.prototype.generateMips = function (levels) {
        if (!levels)
            return;
        var src = this.source;
        if (!tmpCanvas)
            tmpCanvas = document.createElement("canvas");
        var sw = ((src.width + 1) >> 1) << 1;
        var h = src.height;
        var sh = 0;
        for (var i = 1; i <= levels; i++) {
            sh += h;
            h = (h + 1) >> 1;
        }
        if (tmpCanvas.width < sw) {
            tmpCanvas.width = sw;
        }
        if (tmpCanvas.height < sh) {
            tmpCanvas.height = sh;
        }
        var context = tmpCanvas.getContext("2d");
        context.clearRect(0, 0, sw, sh);
        this._mips = [];
        var w = src.width;
        h = src.height;
        context.drawImage(src, 0, 0, w, h, 0, 0, w / 2, h / 2);
        var h1 = 0;
        for (var i = 1; i <= levels; i++) {
            w = (w + 1) >> 1;
            h = (h + 1) >> 1;
            var data = context.getImageData(0, h1, w, h);
            this._mips.push({
                width: data.width,
                height: data.height,
                data: new Uint8Array(data.data)
            });
            if (i < levels) {
                context.drawImage(tmpCanvas, 0, h1, w, h, 0, h1 + h, w / 2, h / 2);
                h1 += h;
            }
        }
    };
})(pixi_heaven || (pixi_heaven = {}));
if (!PIXI.GroupD8.isVertical) {
    PIXI.GroupD8.isVertical = function (rotation) {
        return (rotation & 3) === 2;
    };
}
var pixi_heaven;
(function (pixi_heaven) {
    PIXI.glCore.GLTexture.prototype._updateID = -1;
    PIXI.BaseTexture.prototype._updateID = 0;
    PIXI.BaseTexture.prototype.resource = null;
    PIXI.BaseTexture.prototype.forceUploadStyle = true;
    function bindTexture(texture, location, forceLocation) {
        texture = texture || this.emptyTextures[location];
        texture = texture.baseTexture || texture;
        texture.touched = this.textureGC.count;
        if (!forceLocation) {
            for (var i = 0; i < this.boundTextures.length; i++) {
                if (this.boundTextures[i] === texture) {
                    return i;
                }
            }
            if (location === undefined) {
                this._nextTextureLocation++;
                this._nextTextureLocation %= this.boundTextures.length;
                location = this.boundTextures.length - this._nextTextureLocation - 1;
            }
        }
        else {
            location = location || 0;
        }
        var gl = this.gl;
        var glTexture = texture._glTextures[this.CONTEXT_UID];
        if (texture === this.emptyTextures[location]) {
            glTexture._updateID = 0;
        }
        if (!glTexture || glTexture._updateID < texture._updateID) {
            this.textureManager.updateTexture(texture, location);
        }
        else {
            this.boundTextures[location] = texture;
            gl.activeTexture(gl.TEXTURE0 + location);
            gl.bindTexture(gl.TEXTURE_2D, glTexture.texture);
        }
        return location;
    }
    PIXI.WebGLRenderer.prototype.bindTexture = bindTexture;
})(pixi_heaven || (pixi_heaven = {}));
var pixi_heaven;
(function (pixi_heaven) {
    var mesh;
    (function (mesh) {
        var tempPoint = new PIXI.Point();
        var tempPolygon = new PIXI.Polygon();
        var Mesh = (function (_super) {
            __extends(Mesh, _super);
            function Mesh(texture, vertices, uvs, indices, drawMode) {
                if (texture === void 0) {
                    texture = PIXI.Texture.EMPTY;
                }
                if (drawMode === void 0) {
                    drawMode = PIXI.mesh.Mesh.DRAW_MODES.TRIANGLE_MESH;
                }
                var _this = _super.call(this) || this;
                _this.dirty = 0;
                _this.indexDirty = 0;
                _this.blendMode = PIXI.BLEND_MODES.NORMAL;
                _this.canvasPadding = 0;
                _this.tintRgb = new Float32Array([1, 1, 1]);
                _this._glDatas = {};
                _this.uploadUvTransform = false;
                _this.pluginName = 'meshHeaven';
                _this.color = new pixi_heaven.ColorTransform();
                _this._texture = texture;
                if (!texture.baseTexture.hasLoaded) {
                    texture.once('update', _this._onTextureUpdate, _this);
                }
                _this.uvs = uvs || new Float32Array([
                    0, 0,
                    1, 0,
                    1, 1,
                    0, 1
                ]);
                _this.vertices = vertices || new Float32Array([
                    0, 0,
                    100, 0,
                    100, 100,
                    0, 100
                ]);
                _this.indices = indices || new Uint16Array([0, 1, 3, 2]);
                _this.colors = null;
                _this.drawMode = drawMode;
                _this._uvTransform = new PIXI.TextureMatrix(texture, 0);
                return _this;
            }
            Mesh.prototype.updateTransform = function () {
                this.refresh();
                this._boundsID++;
                this.transform.updateTransform(this.parent.transform);
                this.worldAlpha = this.alpha * this.parent.worldAlpha;
                if (this.color) {
                    this.color.alpha = this.worldAlpha;
                    this.color.updateTransform();
                }
                for (var i = 0, j = this.children.length; i < j; ++i) {
                    var child = this.children[i];
                    if (child.visible) {
                        child.updateTransform();
                    }
                }
            };
            Mesh.prototype._renderWebGL = function (renderer) {
                renderer.setObjectRenderer(renderer.plugins[this.pluginName]);
                renderer.plugins[this.pluginName].render(this);
            };
            Mesh.prototype._renderCanvas = function (renderer) {
                renderer.plugins['mesh'].render(this);
            };
            Mesh.prototype._onTextureUpdate = function () {
                this._uvTransform.texture = this._texture;
                this.color.pma = this._texture.baseTexture.premultipliedAlpha;
                this.refresh();
            };
            Mesh.prototype.multiplyUvs = function () {
                if (!this.uploadUvTransform) {
                    this._uvTransform.multiplyUvs(this.uvs);
                }
            };
            Mesh.prototype.refresh = function (forceUpdate) {
                if (forceUpdate === void 0) {
                    forceUpdate = false;
                }
                if (this._uvTransform.update(forceUpdate)) {
                    this._refreshUvs();
                }
            };
            Mesh.prototype._refreshUvs = function () {
            };
            Mesh.prototype._calculateBounds = function () {
                this._bounds.addVertices(this.transform, this.vertices, 0, this.vertices.length);
            };
            Mesh.prototype.containsPoint = function (point) {
                if (!this.getBounds().contains(point.x, point.y)) {
                    return false;
                }
                this.worldTransform.applyInverse(point, tempPoint);
                var vertices = this.vertices;
                var points = tempPolygon.points;
                var indices = this.indices;
                var len = this.indices.length;
                var step = this.drawMode === Mesh.DRAW_MODES.TRIANGLES ? 3 : 1;
                for (var i = 0; i + 2 < len; i += step) {
                    var ind0 = indices[i] * 2;
                    var ind1 = indices[i + 1] * 2;
                    var ind2 = indices[i + 2] * 2;
                    points[0] = vertices[ind0];
                    points[1] = vertices[ind0 + 1];
                    points[2] = vertices[ind1];
                    points[3] = vertices[ind1 + 1];
                    points[4] = vertices[ind2];
                    points[5] = vertices[ind2 + 1];
                    if (tempPolygon.contains(tempPoint.x, tempPoint.y)) {
                        return true;
                    }
                }
                return false;
            };
            Object.defineProperty(Mesh.prototype, "texture", {
                get: function () {
                    return this._texture;
                },
                set: function (value) {
                    if (this._texture === value) {
                        return;
                    }
                    this._texture = value;
                    if (value) {
                        if (value.baseTexture.hasLoaded) {
                            this._onTextureUpdate();
                        }
                        else {
                            value.once('update', this._onTextureUpdate, this);
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            Mesh.prototype.enableColors = function () {
                this.pluginName = 'meshColored';
                var len = this.vertices.length / 2;
                var colors = new Uint32Array(len * 2);
                this.colors = colors;
                for (var i = 0; i < len; i++) {
                    this.colors[i * 2] = 0;
                    this.colors[i * 2 + 1] = 0xffffffff;
                }
            };
            Mesh.prototype.setRGB = function (rgb, dark) {
                var colors = this.colors;
                var j = dark ? 0 : 1;
                var a = dark ? 0 : (0xff << 24);
                for (var i = 0; i < rgb.length; i += 3) {
                    colors[j] = a | ((rgb[i] * 255) << 16) | ((rgb[i + 1] * 255) << 8) | ((rgb[i + 2] * 255) << 0);
                    j += 2;
                }
                this.dirty++;
            };
            Object.defineProperty(Mesh.prototype, "tint", {
                get: function () {
                    return this.color ? this.color.tintBGR : 0xffffff;
                },
                set: function (value) {
                    this.color && (this.color.tintBGR = value);
                },
                enumerable: true,
                configurable: true
            });
            Mesh.DRAW_MODES = PIXI.mesh.Mesh.DRAW_MODES;
            return Mesh;
        }(PIXI.Container));
        mesh.Mesh = Mesh;
    })(mesh = pixi_heaven.mesh || (pixi_heaven.mesh = {}));
})(pixi_heaven || (pixi_heaven = {}));
var pixi_heaven;
(function (pixi_heaven) {
    var mesh;
    (function (mesh) {
        var GroupD8 = PIXI.GroupD8;
        var Plane = (function (_super) {
            __extends(Plane, _super);
            function Plane(texture, verticesX, verticesY, direction) {
                if (verticesX === void 0) {
                    verticesX = 2;
                }
                if (verticesY === void 0) {
                    verticesY = 2;
                }
                if (direction === void 0) {
                    direction = 0;
                }
                var _this = _super.call(this, texture) || this;
                _this._dimensionsID = 0;
                _this._lastDimensionsID = -1;
                _this._verticesID = 0;
                _this._lastVerticesID = -1;
                _this._uvsID = 0;
                _this._lastUvsID = -1;
                _this.autoResetVertices = true;
                _this.calculatedVertices = null;
                _this._verticesX = verticesX || 2;
                _this._verticesY = verticesY || 2;
                _this._direction = (direction || 0) & (~1);
                _this._lastWidth = texture.orig.width;
                _this._lastHeight = texture.orig.height;
                _this._width = 0;
                _this._height = 0;
                _this._anchor = new PIXI.ObservablePoint(_this._onAnchorUpdate, _this);
                _this.drawMode = mesh.Mesh.DRAW_MODES.TRIANGLES;
                _this.refresh();
                return _this;
            }
            Object.defineProperty(Plane.prototype, "verticesX", {
                get: function () {
                    return this._verticesX;
                },
                set: function (value) {
                    if (this._verticesX === value) {
                        return;
                    }
                    this._verticesX = value;
                    this._dimensionsID++;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Plane.prototype, "verticesY", {
                get: function () {
                    return this._verticesY;
                },
                set: function (value) {
                    if (this._verticesY === value) {
                        return;
                    }
                    this._verticesY = value;
                    this._dimensionsID++;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Plane.prototype, "direction", {
                get: function () {
                    return this._direction;
                },
                set: function (value) {
                    if (value % 2 !== 0) {
                        throw new Error('plane does not support diamond shape yet');
                    }
                    if (this._direction === value) {
                        return;
                    }
                    this._direction = value;
                    this._verticesID++;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Plane.prototype, "width", {
                get: function () {
                    return this._width || this.texture.orig.width;
                },
                set: function (value) {
                    if (this._width === value) {
                        return;
                    }
                    this._width = value;
                    this._verticesID++;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Plane.prototype, "height", {
                get: function () {
                    return this._height || this.texture.orig.height;
                },
                set: function (value) {
                    if (this._height === value) {
                        return;
                    }
                    this._height = value;
                    this._verticesID++;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Plane.prototype, "anchor", {
                get: function () {
                    return this._anchor;
                },
                set: function (value) {
                    this._anchor.copy(value);
                },
                enumerable: true,
                configurable: true
            });
            Plane.prototype._onAnchorUpdate = function () {
                this._verticesID++;
            };
            Plane.prototype.invalidateVertices = function () {
                this._verticesID++;
            };
            Plane.prototype.invalidateUvs = function () {
                this._uvsID++;
            };
            Plane.prototype.invalidate = function () {
                this._verticesID++;
                this._uvsID++;
            };
            Plane.prototype.refresh = function (forceUpdate) {
                if (forceUpdate === void 0) {
                    forceUpdate = false;
                }
                this.refreshDimensions(forceUpdate);
                if (this._texture.noFrame) {
                    return;
                }
                if (this._lastWidth !== this.width
                    || this._lastHeight !== this.height) {
                    this._lastWidth = this.width;
                    this._lastHeight = this.height;
                    if (this.autoResetVertices) {
                        this._verticesID++;
                    }
                }
                if (this._uvTransform.update(forceUpdate)) {
                    this._uvsID++;
                }
                if (this._uvsID !== this._lastUvsID) {
                    this._refreshUvs();
                }
                this.refreshVertices();
            };
            Plane.prototype.refreshDimensions = function (forceUpdate) {
                if (forceUpdate === void 0) {
                    forceUpdate = false;
                }
                if (!forceUpdate && this._lastDimensionsID === this._dimensionsID) {
                    return;
                }
                this._lastDimensionsID = this._dimensionsID;
                this._verticesID++;
                this._uvsID++;
                var total = this._verticesX * this._verticesY;
                var segmentsX = this._verticesX - 1;
                var segmentsY = this._verticesY - 1;
                var indices = [];
                var totalSub = segmentsX * segmentsY;
                for (var i = 0; i < totalSub; i++) {
                    var xpos = i % segmentsX;
                    var ypos = (i / segmentsX) | 0;
                    var value = (ypos * this._verticesX) + xpos;
                    var value2 = (ypos * this._verticesX) + xpos + 1;
                    var value3 = ((ypos + 1) * this._verticesX) + xpos;
                    var value4 = ((ypos + 1) * this._verticesX) + xpos + 1;
                    indices.push(value, value2, value3);
                    indices.push(value2, value4, value3);
                }
                this.indices = new Uint16Array(indices);
                this.uvs = new Float32Array(total * 2);
                this.vertices = new Float32Array(total * 2);
                this.calculatedVertices = new Float32Array(total * 2);
                this.indexDirty++;
                if (this.colors) {
                    this.colors = new Uint32Array(total * 2);
                    for (var i = 0; i < total; i++) {
                        this.colors[i * 2] = 0;
                        this.colors[i * 2 + 1] = 0xffffffff;
                    }
                }
            };
            Plane.prototype.refreshVertices = function (forceUpdate) {
                if (forceUpdate === void 0) {
                    forceUpdate = false;
                }
                var texture = this._texture;
                if (texture.noFrame) {
                    return;
                }
                if (forceUpdate || this._lastVerticesID !== this._verticesID) {
                    this._lastVerticesID = this._verticesID;
                    this._refreshVertices();
                }
            };
            Plane.prototype._refreshUvs = function () {
                this._uvsID = this._lastUvsID;
                var total = this._verticesX * this._verticesY;
                var uvs = this.uvs;
                var direction = this._direction;
                var ux = GroupD8.uX(direction);
                var uy = GroupD8.uY(direction);
                var vx = GroupD8.vX(direction);
                var vy = GroupD8.vY(direction);
                var factorU = 1.0 / (this._verticesX - 1);
                var factorV = 1.0 / (this._verticesY - 1);
                for (var i = 0; i < total; i++) {
                    var x = (i % this._verticesX);
                    var y = ((i / this._verticesX) | 0);
                    x = (x * factorU) - 0.5;
                    y = (y * factorV) - 0.5;
                    uvs[i * 2] = (ux * x) + (vx * y) + 0.5;
                    uvs[(i * 2) + 1] = (uy * x) + (vy * y) + 0.5;
                }
                this.dirty++;
                this.multiplyUvs();
            };
            Plane.prototype.calcVertices = function () {
                var total = this._verticesX * this._verticesY;
                var vertices = this.calculatedVertices;
                var width = this.width;
                var height = this.height;
                var direction = this._direction;
                var ux = GroupD8.uX(direction);
                var uy = GroupD8.uY(direction);
                var vx = GroupD8.vX(direction);
                var vy = GroupD8.vY(direction);
                var anchor = this._anchor;
                var offsetX = (0.5 * (1 - (ux + vx))) - anchor._x;
                var offsetY = (0.5 * (1 - (uy + vy))) - anchor._y;
                var factorU = 1.0 / (this._verticesX - 1);
                var factorV = 1.0 / (this._verticesY - 1);
                ux *= factorU;
                uy *= factorU;
                vx *= factorV;
                vy *= factorV;
                for (var i = 0; i < total; i++) {
                    var x = (i % this._verticesX);
                    var y = ((i / this._verticesX) | 0);
                    vertices[i * 2] = ((ux * x) + (vx * y) + offsetX) * width;
                    vertices[(i * 2) + 1] = ((uy * x) + (vy * y) + offsetY) * height;
                }
            };
            Plane.prototype.calcColors = function () {
            };
            Plane.prototype._refreshVertices = function () {
                this.calcVertices();
                var vertices = this.vertices;
                var calculatedVertices = this.calculatedVertices;
                var len = vertices.length;
                for (var i = 0; i < len; i++) {
                    vertices[i] = calculatedVertices[i];
                }
                if (this.colors) {
                    this.calcColors();
                }
            };
            Plane.prototype.reset = function () {
                if (!this.texture.noFrame) {
                    this._refreshUvs();
                    this.refreshVertices(true);
                }
            };
            return Plane;
        }(mesh.Mesh));
        mesh.Plane = Plane;
    })(mesh = pixi_heaven.mesh || (pixi_heaven.mesh = {}));
})(pixi_heaven || (pixi_heaven = {}));
var pixi_heaven;
(function (pixi_heaven) {
    var mesh;
    (function (mesh) {
        var DEFAULT_BORDER_SIZE = 10;
        var NineSlicePlane = (function (_super) {
            __extends(NineSlicePlane, _super);
            function NineSlicePlane(texture, leftWidth, topHeight, rightWidth, bottomHeight) {
                if (leftWidth === void 0) {
                    leftWidth = DEFAULT_BORDER_SIZE;
                }
                if (topHeight === void 0) {
                    topHeight = DEFAULT_BORDER_SIZE;
                }
                if (rightWidth === void 0) {
                    rightWidth = DEFAULT_BORDER_SIZE;
                }
                if (bottomHeight === void 0) {
                    bottomHeight = DEFAULT_BORDER_SIZE;
                }
                var _this = _super.call(this, texture, 4, 4) || this;
                _this._leftWidth = leftWidth;
                _this._rightWidth = rightWidth;
                _this._topHeight = topHeight;
                _this._bottomHeight = bottomHeight;
                _this.refresh(true);
                return _this;
            }
            Object.defineProperty(NineSlicePlane.prototype, "leftWidth", {
                get: function () {
                    return this._leftWidth;
                },
                set: function (value) {
                    if (this._leftWidth === value) {
                        return;
                    }
                    this._leftWidth = value;
                    this._verticesID++;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NineSlicePlane.prototype, "rightWidth", {
                get: function () {
                    return this._rightWidth;
                },
                set: function (value) {
                    if (this._rightWidth === value) {
                        return;
                    }
                    this._rightWidth = value;
                    this._verticesID++;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NineSlicePlane.prototype, "topHeight", {
                get: function () {
                    return this._topHeight;
                },
                set: function (value) {
                    if (this._topHeight === value) {
                        return;
                    }
                    this._topHeight = value;
                    this._verticesID++;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NineSlicePlane.prototype, "bottomHeight", {
                get: function () {
                    return this._bottomHeight;
                },
                set: function (value) {
                    if (this._bottomHeight === value) {
                        return;
                    }
                    this._bottomHeight = value;
                    this._verticesID++;
                },
                enumerable: true,
                configurable: true
            });
            NineSlicePlane.prototype._refreshVertices = function () {
                this.updateHorizontalVertices();
                this.updateVerticalVertices();
                var vertices = this.vertices;
                var anchor = this._anchor;
                var offsetX = anchor._x * this.width;
                var offsetY = anchor._y * this.height;
                for (var i = 0; i < 32; i += 2) {
                    vertices[i] += offsetX;
                    vertices[i + 1] += offsetY;
                }
                this.dirty++;
            };
            NineSlicePlane.prototype._refreshUvs = function () {
                this._uvsID = this._lastUvsID;
                var uvs = this.uvs;
                var texture = this._texture;
                var width = texture.orig.width;
                var height = texture.orig.height;
                uvs[0] = uvs[8] = uvs[16] = uvs[24] = 0;
                uvs[2] = uvs[10] = uvs[18] = uvs[26] = this._leftWidth / width;
                uvs[4] = uvs[12] = uvs[20] = uvs[28] = 1 - (this._rightWidth / width);
                uvs[6] = uvs[14] = uvs[22] = uvs[30] = 1;
                uvs[1] = uvs[3] = uvs[5] = uvs[7] = 0;
                uvs[9] = uvs[11] = uvs[13] = uvs[15] = this._topHeight / height;
                uvs[17] = uvs[19] = uvs[21] = uvs[23] = 1 - (this._bottomHeight / height);
                uvs[25] = uvs[27] = uvs[29] = uvs[31] = 1;
                this.dirty++;
                this.multiplyUvs();
            };
            NineSlicePlane.prototype.updateHorizontalVertices = function () {
                var vertices = this.vertices;
                vertices[1] = vertices[3] = vertices[5] = vertices[7] = 0;
                vertices[9] = vertices[11] = vertices[13] = vertices[15] = this._topHeight;
                vertices[17] = vertices[19] = vertices[21] = vertices[23] = this._height - this._bottomHeight;
                vertices[25] = vertices[27] = vertices[29] = vertices[31] = this._height;
            };
            NineSlicePlane.prototype.updateVerticalVertices = function () {
                var vertices = this.vertices;
                vertices[0] = vertices[8] = vertices[16] = vertices[24] = 0;
                vertices[2] = vertices[10] = vertices[18] = vertices[26] = this._leftWidth;
                vertices[4] = vertices[12] = vertices[20] = vertices[28] = this._width - this._rightWidth;
                vertices[6] = vertices[14] = vertices[22] = vertices[30] = this._width;
            };
            NineSlicePlane.prototype._renderCanvas = function (renderer) {
                if (!this._texture.valid) {
                    return;
                }
                if (this._texture.rotate) {
                    _super.prototype._renderCanvas.call(this, renderer);
                    return;
                }
                var context = renderer.context;
                context.globalAlpha = this.worldAlpha;
                var transform = this.worldTransform;
                var res = renderer.resolution;
                if (renderer.roundPixels) {
                    context.setTransform(transform.a * res, transform.b * res, transform.c * res, transform.d * res, (transform.tx * res) | 0, (transform.ty * res) | 0);
                }
                else {
                    context.setTransform(transform.a * res, transform.b * res, transform.c * res, transform.d * res, transform.tx * res, transform.ty * res);
                }
                var base = this._texture.baseTexture;
                var textureSource = base.source;
                var w = base.realWidth;
                var h = base.realHeight;
                this.drawSegment(context, textureSource, w, h, 0, 1, 10, 11);
                this.drawSegment(context, textureSource, w, h, 2, 3, 12, 13);
                this.drawSegment(context, textureSource, w, h, 4, 5, 14, 15);
                this.drawSegment(context, textureSource, w, h, 8, 9, 18, 19);
                this.drawSegment(context, textureSource, w, h, 10, 11, 20, 21);
                this.drawSegment(context, textureSource, w, h, 12, 13, 22, 23);
                this.drawSegment(context, textureSource, w, h, 16, 17, 26, 27);
                this.drawSegment(context, textureSource, w, h, 18, 19, 28, 29);
                this.drawSegment(context, textureSource, w, h, 20, 21, 30, 31);
            };
            NineSlicePlane.prototype.drawSegment = function (context, textureSource, w, h, x1, y1, x2, y2) {
                var uvs = this.uvs;
                var vertices = this.vertices;
                var sw = (uvs[x2] - uvs[x1]) * w;
                var sh = (uvs[y2] - uvs[y1]) * h;
                var dw = vertices[x2] - vertices[x1];
                var dh = vertices[y2] - vertices[y1];
                if (sw < 1) {
                    sw = 1;
                }
                if (sh < 1) {
                    sh = 1;
                }
                if (dw < 1) {
                    dw = 1;
                }
                if (dh < 1) {
                    dh = 1;
                }
                context.drawImage(textureSource, uvs[x1] * w, uvs[y1] * h, sw, sh, vertices[x1], vertices[y1], dw, dh);
            };
            return NineSlicePlane;
        }(mesh.Plane));
        mesh.NineSlicePlane = NineSlicePlane;
    })(mesh = pixi_heaven.mesh || (pixi_heaven.mesh = {}));
})(pixi_heaven || (pixi_heaven = {}));
var pixi_heaven;
(function (pixi_heaven) {
    var mesh;
    (function (mesh) {
        var GroupD8 = PIXI.GroupD8;
        var Rope = (function (_super) {
            __extends(Rope, _super);
            function Rope(texture, verticesX, verticesY, direction) {
                if (verticesY === void 0) {
                    verticesY = 2;
                }
                if (direction === void 0) {
                    direction = 0;
                }
                var _this = _super.call(this, texture, verticesX.length || verticesX, verticesY, direction) || this;
                _this.points = [];
                _this.calculatedPoints = [];
                _this.autoUpdate = true;
                _this.points = [];
                _this.calculatedPoints = [];
                if (verticesX instanceof Array) {
                    _this.points = verticesX;
                    _this.autoResetVertices = false;
                }
                _this._checkPointsLen();
                if (GroupD8.isVertical(direction)) {
                    _this._anchor._x = 0.5;
                }
                else {
                    _this._anchor._y = 0.5;
                }
                _this.refresh();
                return _this;
            }
            Rope.prototype.updateTransform = function () {
                if (this.autoUpdate) {
                    this._verticesID++;
                }
                this.refresh();
                this.containerUpdateTransform();
            };
            Rope.prototype._onAnchorUpdate = function () {
                this.reset();
            };
            Rope.prototype._checkPointsLen = function () {
                var len = this._verticesX;
                var points = this.points;
                var calculatedPoints = this.calculatedPoints;
                if (points.length > len) {
                    points.length = len;
                }
                while (points.length < len) {
                    points.push(new mesh.RopePoint(0, 0, 0, 1.0));
                }
                if (calculatedPoints.length > len) {
                    calculatedPoints.length = len;
                }
                while (calculatedPoints.length < len) {
                    calculatedPoints.push(new mesh.RopePoint(0, 0, 0, 1.0));
                }
            };
            Rope.prototype.refresh = function (forceUpdate) {
                if (forceUpdate === void 0) {
                    forceUpdate = false;
                }
                if (!this.points || this._texture.noFrame) {
                    return;
                }
                if (this._lastWidth !== this.width
                    || this._lastHeight !== this.height) {
                    this._lastWidth = this.width;
                    this._lastHeight = this.height;
                    if (this.autoResetVertices) {
                        this.resetPoints();
                    }
                }
                _super.prototype.refresh.call(this, forceUpdate);
            };
            Rope.prototype.calcPoints = function () {
                var len = this._verticesX;
                var points = this.calculatedPoints;
                var dir = this._direction;
                var width = this.width;
                var height = this.height;
                var dx = GroupD8.uX(dir);
                var dy = GroupD8.uY(dir);
                var anchor = this._anchor;
                var offsetX = dx !== 0 ? 0.5 - anchor._x : 0;
                var offsetY = dy !== 0 ? 0.5 - anchor._y : 0;
                for (var i = 0; i < len; i++) {
                    var t = (i - ((len - 1) * 0.5)) / (len - 1);
                    points[i].x = ((t * dx) + offsetX) * width;
                    points[i].y = ((t * dy) + offsetY) * height;
                }
            };
            Rope.prototype.resetPoints = function () {
                this.calcPoints();
                var len = this._verticesX;
                var points = this.points;
                var calculatedPoints = this.calculatedPoints;
                for (var i = 0; i < len; i++) {
                    points[i].x = calculatedPoints[i].x;
                    points[i].y = calculatedPoints[i].y;
                }
            };
            Rope.prototype.resetOffsets = function () {
                var points = this.points;
                var len = points.length;
                for (var i = 0; i < len; i++) {
                    points[i].offset = 0.0;
                }
                for (var i = 0; i < len; i++) {
                    points[i].scale = 1.0;
                }
            };
            Rope.prototype.reset = function () {
                this._checkPointsLen();
                this.resetPoints();
                this.resetOffsets();
                _super.prototype.reset.call(this);
            };
            Rope.prototype.calcVertices = function () {
                var points = this.points;
                var lastPoint = points[0];
                var nextPoint;
                var normalX = 0;
                var normalY = 0;
                var width = this.width;
                var height = this.height;
                var vertices = this.calculatedVertices;
                var verticesX = this.verticesX;
                var verticesY = this.verticesY;
                var direction = this._direction;
                var vx = GroupD8.vX(direction);
                var vy = GroupD8.vY(direction);
                var wide = (vx * width) + (vy * height);
                var anchor = this._anchor;
                var normalOffset = wide * ((anchor._x * vx) + (anchor._y * vy));
                var normalFactor = -Math.abs(wide) / (verticesY - 1);
                for (var i = 0; i < verticesX; i++) {
                    var point = points[i];
                    var offset = points[i].offset || 0;
                    var scale = (points[i].scale !== undefined) ? points[i].scale : 1.0;
                    if (i < points.length - 1) {
                        nextPoint = points[i + 1];
                    }
                    else {
                        nextPoint = point;
                    }
                    normalY = -(nextPoint.x - lastPoint.x);
                    normalX = nextPoint.y - lastPoint.y;
                    var perpLength = Math.sqrt((normalX * normalX) + (normalY * normalY));
                    normalX /= perpLength;
                    normalY /= perpLength;
                    for (var j = 0; j < verticesY; j++) {
                        var ind = (i + (j * verticesX)) * 2;
                        vertices[ind] = point.x + (normalX * (offset + (scale * (normalOffset + (normalFactor * j)))));
                        vertices[ind + 1] = point.y + (normalY * (offset + (scale * (normalOffset + (normalFactor * j)))));
                    }
                    lastPoint = point;
                }
            };
            Rope.prototype.calcColors = function () {
                var colors = this.colors;
                var points = this.points;
                var verticesX = this.verticesX;
                var verticesY = this.verticesY;
                var j = 0;
                for (var i = 0; i < verticesX; i++) {
                    var color = points[i].color;
                    if (color._currentUpdateID !== color._updateID) {
                        color.updateTransformLocal();
                        this.dirty++;
                    }
                    for (var j_1 = 0; j_1 < verticesY; j_1++) {
                        var ind = (i + (j_1 * verticesX)) * 2;
                        colors[ind] = color.darkRgba;
                        colors[ind + 1] = color.lightRgba;
                    }
                }
            };
            Rope.prototype.enableColors = function () {
                for (var i = 0; i < this.points.length; i++) {
                    this.points[i].color;
                }
                _super.prototype.enableColors.call(this);
            };
            return Rope;
        }(mesh.Plane));
        mesh.Rope = Rope;
    })(mesh = pixi_heaven.mesh || (pixi_heaven.mesh = {}));
})(pixi_heaven || (pixi_heaven = {}));
var pixi_heaven;
(function (pixi_heaven) {
    var mesh;
    (function (mesh) {
        var RopePoint = (function (_super) {
            __extends(RopePoint, _super);
            function RopePoint(x, y, offset, scale) {
                if (x === void 0) {
                    x = 0;
                }
                if (y === void 0) {
                    y = 0;
                }
                if (offset === void 0) {
                    offset = 0;
                }
                if (scale === void 0) {
                    scale = 1.0;
                }
                var _this = _super.call(this, x, y) || this;
                _this.offset = offset;
                _this.scale = scale;
                _this._color = null;
                return _this;
            }
            Object.defineProperty(RopePoint.prototype, "color", {
                get: function () {
                    if (this._color === null) {
                        this._color = new pixi_heaven.ColorTransform();
                    }
                    return this._color;
                },
                set: function (val) {
                    if (typeof val === "number") {
                        this.color.tintBGR = val;
                    }
                    else {
                        this.color = val;
                    }
                },
                enumerable: true,
                configurable: true
            });
            RopePoint.prototype.clone = function () {
                return new RopePoint(this.x, this.y, this.offset, this.scale);
            };
            RopePoint.prototype.copy = function (p) {
                this.set(p.x, p.y, p.offset, p.scale);
            };
            RopePoint.prototype.set = function (x, y, offset, scale) {
                this.x = x || 0;
                this.y = y || ((y !== 0) ? this.x : 0);
                this.offset = offset || 0;
                this.scale = (scale !== undefined) ? scale : 1.0;
            };
            return RopePoint;
        }(PIXI.Point));
        mesh.RopePoint = RopePoint;
    })(mesh = pixi_heaven.mesh || (pixi_heaven.mesh = {}));
})(pixi_heaven || (pixi_heaven = {}));
var pixi_heaven;
(function (pixi_heaven) {
    var mesh;
    (function (mesh_1) {
        var glCore = PIXI.glCore;
        var utils = PIXI.utils;
        var matrixIdentity = PIXI.Matrix.IDENTITY;
        var MeshColoredRenderer = (function (_super) {
            __extends(MeshColoredRenderer, _super);
            function MeshColoredRenderer() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.shader = null;
                _this.shaderTrim = null;
                return _this;
            }
            MeshColoredRenderer.prototype.onContextChange = function () {
                var gl = this.renderer.gl;
                this.shader = new PIXI.Shader(gl, MeshColoredRenderer.vert, MeshColoredRenderer.frag);
                this.shaderTrim = new PIXI.Shader(gl, MeshColoredRenderer.vert, MeshColoredRenderer.fragTrim);
            };
            MeshColoredRenderer.prototype.render = function (mesh) {
                var renderer = this.renderer;
                var gl = renderer.gl;
                var texture = mesh._texture;
                if (!texture.valid) {
                    return;
                }
                var glData = mesh._glDatas[renderer.CONTEXT_UID];
                if (!glData || !glData.colorBuffer) {
                    renderer.bindVao(null);
                    glData = {
                        vertexBuffer: glCore.GLBuffer.createVertexBuffer(gl, mesh.vertices, gl.STREAM_DRAW),
                        uvBuffer: glCore.GLBuffer.createVertexBuffer(gl, mesh.uvs, gl.STREAM_DRAW),
                        colorBuffer: glCore.GLBuffer.createVertexBuffer(gl, mesh.colors, gl.STREAM_DRAW),
                        indexBuffer: glCore.GLBuffer.createIndexBuffer(gl, mesh.indices, gl.STATIC_DRAW),
                        vao: null,
                        dirty: mesh.dirty,
                        indexDirty: mesh.indexDirty
                    };
                    var attrs = this.shader.attributes;
                    glData.vao = new glCore.VertexArrayObject(gl)
                        .addIndex(glData.indexBuffer)
                        .addAttribute(glData.vertexBuffer, attrs.aVertexPosition, gl.FLOAT, false, 2 * 4, 0)
                        .addAttribute(glData.uvBuffer, attrs.aTextureCoord, gl.FLOAT, false, 2 * 4, 0)
                        .addAttribute(glData.colorBuffer, attrs.aDark, gl.UNSIGNED_BYTE, true, 2 * 4, 0)
                        .addAttribute(glData.colorBuffer, attrs.aLight, gl.UNSIGNED_BYTE, true, 2 * 4, 4);
                    mesh._glDatas[renderer.CONTEXT_UID] = glData;
                }
                renderer.bindVao(glData.vao);
                if (mesh.dirty !== glData.dirty) {
                    glData.dirty = mesh.dirty;
                    glData.uvBuffer.upload(mesh.uvs);
                    glData.colorBuffer.upload(mesh.colors);
                }
                if (mesh.indexDirty !== glData.indexDirty) {
                    glData.indexDirty = mesh.indexDirty;
                    glData.indexBuffer.upload(mesh.indices);
                }
                glData.vertexBuffer.upload(mesh.vertices);
                var isTrimmed = texture.trim && (texture.trim.width < texture.orig.width
                    || texture.trim.height < texture.orig.height);
                var shader = isTrimmed ? this.shaderTrim : this.shader;
                renderer.bindShader(shader);
                shader.uniforms.uSampler = renderer.bindTexture(texture);
                renderer.state.setBlendMode(utils.correctBlendMode(mesh.blendMode, texture.baseTexture.premultipliedAlpha));
                if (shader.uniforms.uTransform) {
                    if (mesh.uploadUvTransform) {
                        shader.uniforms.uTransform = mesh._uvTransform.mapCoord.toArray(true);
                    }
                    else {
                        shader.uniforms.uTransform = matrixIdentity.toArray(true);
                    }
                }
                if (isTrimmed) {
                    shader.uniforms.uClampFrame = mesh._uvTransform.uClampFrame;
                }
                shader.uniforms.translationMatrix = mesh.worldTransform.toArray(true);
                shader.uniforms.uLight = mesh.color.light;
                shader.uniforms.uDark = mesh.color.dark;
                var drawMode = mesh.drawMode === mesh_1.Mesh.DRAW_MODES.TRIANGLE_MESH ? gl.TRIANGLE_STRIP : gl.TRIANGLES;
                glData.vao.draw(drawMode, mesh.indices.length, 0);
            };
            MeshColoredRenderer.vert = "\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec4 aDark;\nattribute vec4 aLight;\n\nuniform mat3 projectionMatrix;\nuniform mat3 translationMatrix;\nuniform mat3 uTransform;\nuniform vec4 uLight, uDark;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vDark;\nvarying vec4 vLight;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = (uTransform * vec3(aTextureCoord, 1.0)).xy;\n\n\tvLight.a = uLight.a * aLight.a;\n\tvDark.a = uDark.a;\n\t\n\tvLight.rgb = ((aLight.a - 1.0) * uDark.a + 1.0 - aLight.rgb) * uDark.rgb + aLight.rgb * uLight.rgb;\n\tvDark.rgb = ((aDark.a - 1.0) * uDark.a + 1.0 - aDark.rgb) * uDark.rgb + aDark.rgb * uLight.rgb;\n}\n";
            MeshColoredRenderer.frag = "\nvarying vec2 vTextureCoord;\nvarying vec4 vLight, vDark;\n\nuniform sampler2D uSampler;\n\nvoid main(void)\n{\n    vec4 texColor = texture2D(uSampler, vTextureCoord);\n    gl_FragColor.a = texColor.a * vLight.a;\n\tgl_FragColor.rgb = ((texColor.a - 1.0) * vDark.a + 1.0 - texColor.rgb) * vDark.rgb + texColor.rgb * vLight.rgb;\n}\n";
            MeshColoredRenderer.fragTrim = "\nvarying vec2 vTextureCoord;\nvarying vec4 vLight, vDark;\nuniform vec4 uClampFrame;\n\nuniform sampler2D uSampler;\n\nvoid main(void)\n{\n    vec2 coord = vTextureCoord;\n    if (coord.x < uClampFrame.x || coord.x > uClampFrame.z\n        || coord.y < uClampFrame.y || coord.y > uClampFrame.w)\n            discard;\n    vec4 texColor = texture2D(uSampler, vTextureCoord);\n    gl_FragColor.a = texColor.a * vLight.a;\n\tgl_FragColor.rgb = ((texColor.a - 1.0) * vDark.a + 1.0 - texColor.rgb) * vDark.rgb + texColor.rgb * vLight.rgb;\n}\n";
            return MeshColoredRenderer;
        }(PIXI.ObjectRenderer));
        mesh_1.MeshColoredRenderer = MeshColoredRenderer;
        PIXI.WebGLRenderer.registerPlugin('meshColored', MeshColoredRenderer);
    })(mesh = pixi_heaven.mesh || (pixi_heaven.mesh = {}));
})(pixi_heaven || (pixi_heaven = {}));
var pixi_heaven;
(function (pixi_heaven) {
    var mesh;
    (function (mesh_2) {
        var glCore = PIXI.glCore;
        var utils = PIXI.utils;
        var matrixIdentity = PIXI.Matrix.IDENTITY;
        var MeshHeavenRenderer = (function (_super) {
            __extends(MeshHeavenRenderer, _super);
            function MeshHeavenRenderer() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.shader = null;
                _this.shaderTrim = null;
                return _this;
            }
            MeshHeavenRenderer.prototype.onContextChange = function () {
                var gl = this.renderer.gl;
                this.shader = new PIXI.Shader(gl, MeshHeavenRenderer.vert, MeshHeavenRenderer.frag);
                this.shaderTrim = new PIXI.Shader(gl, MeshHeavenRenderer.vert, MeshHeavenRenderer.fragTrim);
            };
            MeshHeavenRenderer.prototype.render = function (mesh) {
                var renderer = this.renderer;
                var gl = renderer.gl;
                var texture = mesh._texture;
                if (!texture.valid) {
                    return;
                }
                var glData = mesh._glDatas[renderer.CONTEXT_UID];
                if (!glData) {
                    renderer.bindVao(null);
                    glData = {
                        vertexBuffer: glCore.GLBuffer.createVertexBuffer(gl, mesh.vertices, gl.STREAM_DRAW),
                        uvBuffer: glCore.GLBuffer.createVertexBuffer(gl, mesh.uvs, gl.STREAM_DRAW),
                        indexBuffer: glCore.GLBuffer.createIndexBuffer(gl, mesh.indices, gl.STATIC_DRAW),
                        vao: null,
                        dirty: mesh.dirty,
                        indexDirty: mesh.indexDirty
                    };
                    glData.vao = new glCore.VertexArrayObject(gl)
                        .addIndex(glData.indexBuffer)
                        .addAttribute(glData.vertexBuffer, this.shader.attributes.aVertexPosition, gl.FLOAT, false, 2 * 4, 0)
                        .addAttribute(glData.uvBuffer, this.shader.attributes.aTextureCoord, gl.FLOAT, false, 2 * 4, 0);
                    mesh._glDatas[renderer.CONTEXT_UID] = glData;
                }
                renderer.bindVao(glData.vao);
                if (mesh.dirty !== glData.dirty) {
                    glData.dirty = mesh.dirty;
                    glData.uvBuffer.upload(mesh.uvs);
                }
                if (mesh.indexDirty !== glData.indexDirty) {
                    glData.indexDirty = mesh.indexDirty;
                    glData.indexBuffer.upload(mesh.indices);
                }
                glData.vertexBuffer.upload(mesh.vertices);
                var isTrimmed = texture.trim && (texture.trim.width < texture.orig.width
                    || texture.trim.height < texture.orig.height);
                var shader = isTrimmed ? this.shaderTrim : this.shader;
                renderer.bindShader(shader);
                shader.uniforms.uSampler = renderer.bindTexture(texture);
                renderer.state.setBlendMode(utils.correctBlendMode(mesh.blendMode, texture.baseTexture.premultipliedAlpha));
                if (shader.uniforms.uTransform) {
                    if (mesh.uploadUvTransform) {
                        shader.uniforms.uTransform = mesh._uvTransform.mapCoord.toArray(true);
                    }
                    else {
                        shader.uniforms.uTransform = matrixIdentity.toArray(true);
                    }
                }
                if (isTrimmed) {
                    shader.uniforms.uClampFrame = mesh._uvTransform.uClampFrame;
                }
                shader.uniforms.translationMatrix = mesh.worldTransform.toArray(true);
                shader.uniforms.uLight = mesh.color.light;
                shader.uniforms.uDark = mesh.color.dark;
                var drawMode = mesh.drawMode === mesh_2.Mesh.DRAW_MODES.TRIANGLE_MESH ? gl.TRIANGLE_STRIP : gl.TRIANGLES;
                glData.vao.draw(drawMode, mesh.indices.length, 0);
            };
            MeshHeavenRenderer.vert = "\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 translationMatrix;\nuniform mat3 uTransform;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = (uTransform * vec3(aTextureCoord, 1.0)).xy;\n}\n";
            MeshHeavenRenderer.frag = "\nvarying vec2 vTextureCoord;\nuniform vec4 uLight, uDark;\n\nuniform sampler2D uSampler;\n\nvoid main(void)\n{\n    vec4 texColor = texture2D(uSampler, vTextureCoord);\n    gl_FragColor.a = texColor.a * uLight.a;\n\tgl_FragColor.rgb = ((texColor.a - 1.0) * uDark.a + 1.0 - texColor.rgb) * uDark.rgb + texColor.rgb * uLight.rgb;\n}\n";
            MeshHeavenRenderer.fragTrim = "\nvarying vec2 vTextureCoord;\nuniform vec4 uLight, uDark;\nuniform vec4 uClampFrame;\n\nuniform sampler2D uSampler;\n\nvoid main(void)\n{\n    vec2 coord = vTextureCoord;\n    if (coord.x < uClampFrame.x || coord.x > uClampFrame.z\n        || coord.y < uClampFrame.y || coord.y > uClampFrame.w)\n            discard;\n    vec4 texColor = texture2D(uSampler, vTextureCoord);\n    gl_FragColor.a = texColor.a * uLight.a;\n\tgl_FragColor.rgb = ((texColor.a - 1.0) * uDark.a + 1.0 - texColor.rgb) * uDark.rgb + texColor.rgb * uLight.rgb;\n}\n";
            return MeshHeavenRenderer;
        }(PIXI.ObjectRenderer));
        mesh_2.MeshHeavenRenderer = MeshHeavenRenderer;
        PIXI.WebGLRenderer.registerPlugin('meshHeaven', MeshHeavenRenderer);
    })(mesh = pixi_heaven.mesh || (pixi_heaven.mesh = {}));
})(pixi_heaven || (pixi_heaven = {}));
var pixi_heaven;
(function (pixi_heaven) {
    var AtlasOptions = (function () {
        function AtlasOptions(src) {
            this.width = 2048;
            this.height = 2048;
            this.loadFactor = 0.95;
            this.repackBeforeResize = true;
            this.repackAfterResize = true;
            this.algoTreeResize = false;
            this.maxSize = 0;
            this.mipLevels = 0;
            this.padding = 0;
            this.format = WebGLRenderingContext.RGBA;
            if (src) {
                this.assign(src);
            }
        }
        AtlasOptions.prototype.assign = function (src) {
            this.width = src.width || this.width;
            this.height = src.height || src.width || this.height;
            this.maxSize = src.maxSize || AtlasOptions.MAX_SIZE;
            this.format = src.format || this.format;
            this.loadFactor = src.loadFactor || this.loadFactor;
            this.padding = src.padding || this.padding;
            this.mipLevels = src.mipLevels || this.mipLevels;
            if (src.repackAfterResize !== undefined) {
                this.repackAfterResize = src.repackAfterResize;
            }
            if (src.repackBeforeResize !== undefined) {
                this.repackBeforeResize = src.repackBeforeResize;
            }
            if (src.algoTreeResize !== undefined) {
                this.algoTreeResize = src.algoTreeResize;
            }
            return this;
        };
        AtlasOptions.MAX_SIZE = 0;
        return AtlasOptions;
    }());
    pixi_heaven.AtlasOptions = AtlasOptions;
})(pixi_heaven || (pixi_heaven = {}));
var pixi_heaven;
(function (pixi_heaven) {
    var RGBA = WebGLRenderingContext.RGBA;
    var BaseTexture = PIXI.BaseTexture;
    var SuperAtlasEntry = (function () {
        function SuperAtlasEntry() {
        }
        return SuperAtlasEntry;
    }());
    pixi_heaven.SuperAtlasEntry = SuperAtlasEntry;
    var AtlasTree = (function () {
        function AtlasTree() {
            this.failed = [];
            this.good = [];
            this.hash = {};
        }
        AtlasTree.prototype.apply = function () {
            throw new Error("Method not implemented.");
        };
        return AtlasTree;
    }());
    pixi_heaven.AtlasTree = AtlasTree;
    var SuperAtlas = (function () {
        function SuperAtlas() {
            this.baseTexture = null;
            this.format = RGBA;
            this.width = 2048;
            this.height = 2048;
            this.all = {};
            this.tree = null;
            this.imageTextureRebuildUpdateID = 0;
        }
        SuperAtlas.prototype.onTextureNew = function (baseTexture) {
            this.baseTexture = baseTexture;
            baseTexture.resource = this;
            baseTexture.width = this.width;
            baseTexture.height = this.height;
            baseTexture.hasLoaded = true;
            baseTexture.height = this.height;
        };
        SuperAtlas.create = function (options) {
            var opt = options instanceof pixi_heaven.AtlasOptions ? options : new pixi_heaven.AtlasOptions(options);
            var atlas = new SuperAtlas();
            atlas.options = opt;
            atlas.width = opt.width;
            atlas.height = opt.height;
            atlas.format = opt.format;
            atlas.onTextureNew(new PIXI.BaseTexture());
            atlas.tree = new AtlasTree();
            atlas.tree.root = atlas.createAtlasRoot();
            return atlas;
        };
        SuperAtlas.prototype.destroy = function () {
            if (this.baseTexture) {
                this.baseTexture.destroy();
                this.baseTexture = null;
            }
        };
        SuperAtlas.prototype.add = function (texture, swapCache) {
            var baseTexture;
            var arg;
            if (texture instanceof BaseTexture) {
                baseTexture = texture;
                arg = new PIXI.Texture(baseTexture);
            }
            else {
                baseTexture = texture.baseTexture;
                arg = texture;
            }
            var entry = this.all[baseTexture.uid];
            if (!entry) {
                entry = new pixi_heaven.AtlasEntry(this, baseTexture);
                var p1 = this.options.padding, p2 = (1 << this.options.mipLevels);
                var w1 = entry.width + p1, h1 = entry.height + p1;
                entry.width = w1 + (p2 - entry.width % p2) % p2;
                entry.height = h1 + (p2 - entry.height % p2) % p2;
                this.insert(entry);
            }
            var region = new pixi_heaven.TextureRegion(entry, arg);
            if (swapCache) {
                var ids = texture.textureCacheIds;
                for (var i = 0; i < ids.length; i++) {
                    PIXI.utils.TextureCache[ids[i]] = region;
                }
            }
            entry.regions.push(region);
            return region;
        };
        SuperAtlas.prototype.addHash = function (textures, swapCache) {
            var hash = {};
            for (var key in textures) {
                hash[key] = this.add(textures[key], swapCache);
            }
            return hash;
        };
        SuperAtlas.prototype.insert = function (entry) {
            if (this.tryInsert(entry))
                return;
            this.tree.failed.push(entry);
            this.all[entry.baseTexture.uid] = entry;
        };
        SuperAtlas.prototype.remove = function (entry) {
            if (entry.currentNode == null) {
                var failed = this.tree.failed;
                var ind = failed.indexOf(entry);
                if (ind >= 0) {
                    failed.splice(ind, 1);
                }
            }
            else {
                throw new Error("Cant remove packed texture");
            }
        };
        SuperAtlas.prototype.tryInsert = function (entry) {
            var node = this.tree.root.insert(this.width, this.height, entry.width, entry.height, entry);
            if (!node) {
                return false;
            }
            entry.nodeUpdateID = ++this.baseTexture._updateID;
            entry.currentNode = node;
            entry.currentAtlas = this;
            this.all[entry.baseTexture.uid] = entry;
            this.tree.hash[entry.baseTexture.uid] = node;
            this.tree.good.push(entry);
            return true;
        };
        SuperAtlas.prototype.createAtlasRoot = function () {
            var res = new pixi_heaven.AtlasNode();
            if (!this.options.algoTreeResize) {
                res.rect.width = this.width;
                res.rect.height = this.height;
            }
            return res;
        };
        SuperAtlas.prototype.repack = function (failOnFirst) {
            var _this = this;
            if (failOnFirst === void 0) {
                failOnFirst = false;
            }
            var pack = new AtlasTree();
            var all = this.tree.good.slice(0);
            var failed = this.tree.failed;
            for (var i = 0; i < failed.length; i++) {
                all.push(failed[i]);
            }
            all.sort(function (a, b) {
                if (b.width == a.width) {
                    return b.height - a.height;
                }
                return b.width - a.width;
            });
            var root = this.createAtlasRoot();
            pack.root = root;
            for (var _i = 0, all_1 = all; _i < all_1.length; _i++) {
                var obj = all_1[_i];
                var node = root.insert(this.width, this.height, obj.width, obj.height, obj);
                if (!node) {
                    pack.failed.push(obj);
                    if (failOnFirst) {
                        return pack;
                    }
                }
                else {
                    pack.hash[obj.baseTexture.uid] = node;
                }
            }
            pack.apply = function () {
                _this.tree.root = pack.root;
                _this.tree.failed = pack.failed.slice(0);
                _this.tree.hash = pack.hash;
                for (var _i = 0, all_2 = all; _i < all_2.length; _i++) {
                    var obj = all_2[_i];
                    obj.currentNode = pack.hash[obj.baseTexture.uid] || null;
                    obj.currentAtlas = obj.currentNode ? _this : null;
                    for (var _a = 0, _b = obj.regions; _a < _b.length; _a++) {
                        var region = _b[_a];
                        region.updateFrame();
                    }
                }
                _this.imageTextureRebuildUpdateID++;
            };
            return pack;
        };
        SuperAtlas.prototype.prepare = function (renderer) {
            renderer.textureManager.updateTexture(this.baseTexture);
            throw new Error("Method not implemented.");
        };
        SuperAtlas.prototype.onTextureUpload = function (renderer, baseTexture, tex) {
            tex.bind();
            var imgTexture = this.baseTexture;
            var gl = tex.gl;
            var levels = this.options.mipLevels;
            tex.mipmap = levels > 0;
            tex.premultiplyAlpha = imgTexture.premultipliedAlpha;
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, imgTexture.premultipliedAlpha);
            var uploadAll = tex._updateID < this.imageTextureRebuildUpdateID;
            if (uploadAll) {
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, imgTexture.width, imgTexture.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
                if (tex.mipmap) {
                    for (var lvl = 1; (imgTexture.width >> lvl) > 0; lvl++) {
                        gl.texImage2D(gl.TEXTURE_2D, lvl, gl.RGBA, imgTexture.width >> lvl, imgTexture.height >> lvl, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
                    }
                }
            }
            for (var key in this.tree.hash) {
                var node = this.tree.hash[key];
                var entry = node.data;
                var entryTex = entry.baseTexture;
                if (!uploadAll && tex._updateID >= entry.nodeUpdateID)
                    continue;
                var rect = node.rect;
                gl.texSubImage2D(gl.TEXTURE_2D, 0, rect.left, rect.top, gl.RGBA, gl.UNSIGNED_BYTE, entry.baseTexture.source);
                if (levels > 0) {
                    if (!entryTex._mips || entryTex._mips.length < levels) {
                        entryTex.generateMips(levels);
                    }
                    var mips = entryTex._mips;
                    for (var lvl = 1; lvl <= levels; lvl++) {
                        var mip = mips[lvl - 1];
                        gl.texSubImage2D(gl.TEXTURE_2D, lvl, rect.left >> lvl, rect.top >> lvl, mip.width, mip.height, gl.RGBA, gl.UNSIGNED_BYTE, mip.data);
                    }
                }
            }
            return true;
        };
        SuperAtlas.MAX_SIZE = 2048;
        return SuperAtlas;
    }());
    pixi_heaven.SuperAtlas = SuperAtlas;
})(pixi_heaven || (pixi_heaven = {}));
var pixi_heaven;
(function (pixi_heaven) {
    var whiteRgba = [1.0, 1.0, 1.0, 1.0];
    var blackRgba = [0.0, 0.0, 0.0, 1.0];
    var ColorTransform = (function () {
        function ColorTransform() {
            this.dark = new Float32Array(blackRgba);
            this.light = new Float32Array(whiteRgba);
            this._updateID = 0;
            this._currentUpdateID = -1;
            this.darkRgba = 0;
            this.lightRgba = -1;
            this.hasNoTint = true;
        }
        Object.defineProperty(ColorTransform.prototype, "darkR", {
            get: function () {
                return this.dark[0];
            },
            set: function (value) {
                if (this.dark[0] === value)
                    return;
                this.dark[0] = value;
                this._updateID++;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ColorTransform.prototype, "darkG", {
            get: function () {
                return this.dark[1];
            },
            set: function (value) {
                if (this.dark[1] === value)
                    return;
                this.dark[1] = value;
                this._updateID++;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ColorTransform.prototype, "darkB", {
            get: function () {
                return this.dark[2];
            },
            set: function (value) {
                if (this.dark[2] === value)
                    return;
                this.dark[2] = value;
                this._updateID++;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ColorTransform.prototype, "lightR", {
            get: function () {
                return this.light[0];
            },
            set: function (value) {
                if (this.light[0] === value)
                    return;
                this.light[0] = value;
                this._updateID++;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ColorTransform.prototype, "lightG", {
            get: function () {
                return this.light[1];
            },
            set: function (value) {
                if (this.light[1] === value)
                    return;
                this.light[1] = value;
                this._updateID++;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ColorTransform.prototype, "lightB", {
            get: function () {
                return this.light[2];
            },
            set: function (value) {
                if (this.light[2] === value)
                    return;
                this.light[2] = value;
                this._updateID++;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ColorTransform.prototype, "alpha", {
            get: function () {
                return this.light[3];
            },
            set: function (value) {
                if (this.light[3] === value)
                    return;
                this.light[3] = value;
                this._updateID++;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ColorTransform.prototype, "pma", {
            get: function () {
                return this.dark[3] !== 0.0;
            },
            set: function (value) {
                if ((this.dark[3] !== 0.0) !== value)
                    return;
                this.dark[3] = value ? 1.0 : 0.0;
                this._updateID++;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ColorTransform.prototype, "tintBGR", {
            get: function () {
                var light = this.light;
                return ((light[0] * 255) << 16) + ((light[1] * 255) << 8) + (light[2] * 255 | 0);
            },
            set: function (value) {
                this.setLight(((value >> 16) & 0xff) / 255.0, ((value >> 8) & 0xff) / 255.0, (value & 0xff) / 255.0);
            },
            enumerable: true,
            configurable: true
        });
        ColorTransform.prototype.setLight = function (R, G, B) {
            var color = this.light;
            if (color[0] === R && color[1] === G && color[2] === B) {
                return;
            }
            color[0] = R;
            color[1] = G;
            color[2] = B;
            this._updateID++;
        };
        ColorTransform.prototype.setDark = function (R, G, B) {
            var color = this.dark;
            if (color[0] === R && color[1] === G && color[2] === B) {
                return;
            }
            color[0] = R;
            color[1] = G;
            color[2] = B;
            this._updateID++;
        };
        ColorTransform.prototype.clear = function () {
            this.dark[0] = 0.0;
            this.dark[1] = 0.0;
            this.dark[2] = 0.0;
            this.light[0] = 1.0;
            this.light[1] = 1.0;
            this.light[2] = 1.0;
        };
        ColorTransform.prototype.invalidate = function () {
            this._updateID++;
        };
        ColorTransform.prototype.updateTransformLocal = function () {
            var dark = this.dark, light = this.light;
            var la = 255 * (1.0 + (light[3] - 1.0) * dark[3]);
            this.hasNoTint = dark[0] === 0.0 && dark[1] === 0.0 && dark[2] === 0.0
                && light[0] === 1.0 && light[1] === 1.0 && light[2] === 1.0;
            this.darkRgba = (dark[0] * la | 0) + ((dark[1] * la) << 8)
                + ((dark[2] * la) << 16) + ((dark[3] * 255) << 24);
            this.lightRgba = (light[0] * la | 0) + ((light[1] * la) << 8)
                + ((light[2] * la) << 16) + ((light[3] * 255) << 24);
            this._currentUpdateID = this._updateID;
        };
        ColorTransform.prototype.updateTransform = function () {
            if (this._currentUpdateID === this._updateID) {
                return;
            }
            this.updateTransformLocal();
        };
        return ColorTransform;
    }());
    pixi_heaven.ColorTransform = ColorTransform;
})(pixi_heaven || (pixi_heaven = {}));
var pixi_heaven;
(function (pixi_heaven) {
    PIXI.Container.prototype.convertToHeaven = function () {
    };
    function tintGet() {
        return this.color.tintBGR;
    }
    function tintSet(value) {
        this.color.tintBGR = value;
    }
    function tintRGBGet() {
        this.color.updateTransform();
        return this.color.lightRgba & 0xffffff;
    }
    PIXI.Sprite.prototype.convertToHeaven = function () {
        if (this.color) {
            return;
        }
        Object.defineProperty(this, "tint", {
            get: tintGet,
            set: tintSet,
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(this, "_tintRGB", {
            get: tintRGBGet,
            enumerable: true,
            configurable: true
        });
        this._onTextureUpdate = pixi_heaven.Sprite.prototype._onTextureUpdate;
        this.updateTransform = pixi_heaven.Sprite.prototype.updateTransform;
        this.color = new pixi_heaven.ColorTransform();
        this.pluginName = 'spriteHeaven';
        return this;
    };
    PIXI.Container.prototype.convertSubtreeToHeaven = function () {
        if (this.convertToHeaven) {
            this.convertToHeaven();
        }
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].convertSubtreeToHeaven();
        }
    };
})(pixi_heaven || (pixi_heaven = {}));
var pixi_heaven;
(function (pixi_heaven) {
    var sign = PIXI.utils.sign;
    var tempMat = new PIXI.Matrix();
    var Sprite = (function (_super) {
        __extends(Sprite, _super);
        function Sprite(texture) {
            var _this = _super.call(this, texture) || this;
            _this.color = new pixi_heaven.ColorTransform();
            _this.maskSprite = null;
            _this.maskVertexData = null;
            _this.pluginName = 'spriteHeaven';
            if (_this.texture.valid)
                _this._onTextureUpdate();
            return _this;
        }
        Object.defineProperty(Sprite.prototype, "_tintRGB", {
            get: function () {
                this.color.updateTransform();
                return this.color.lightRgba & 0xffffff;
            },
            set: function (value) {
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sprite.prototype, "tint", {
            get: function () {
                return this.color ? this.color.tintBGR : 0xffffff;
            },
            set: function (value) {
                this.color && (this.color.tintBGR = value);
            },
            enumerable: true,
            configurable: true
        });
        Sprite.prototype.updateTransform = function () {
            this._boundsID++;
            this.transform.updateTransform(this.parent.transform);
            this.worldAlpha = this.alpha * this.parent.worldAlpha;
            if (this.color) {
                this.color.alpha = this.worldAlpha;
                this.color.updateTransform();
            }
            for (var i = 0, j = this.children.length; i < j; ++i) {
                var child = this.children[i];
                if (child.visible) {
                    child.updateTransform();
                }
            }
        };
        Sprite.prototype._onTextureUpdate = function () {
            this._textureID = -1;
            this._textureTrimmedID = -1;
            this.cachedTint = 0xFFFFFF;
            if (this.color) {
                this.color.pma = this._texture.baseTexture.premultipliedAlpha;
            }
            if (this._width) {
                this.scale.x = sign(this.scale.x) * this._width / this._texture.orig.width;
            }
            if (this._height) {
                this.scale.y = sign(this.scale.y) * this._height / this._texture.orig.height;
            }
        };
        Sprite.prototype.calculateMaskVertices = function () {
            var maskSprite = this.maskSprite;
            var tex = maskSprite.texture;
            var orig = tex.orig;
            var anchor = maskSprite.anchor;
            if (!tex.valid) {
                return;
            }
            if (!tex.transform) {
                tex.transform = new PIXI.TextureMatrix(tex, 0.0);
            }
            tex.transform.update();
            maskSprite.transform.worldTransform.copy(tempMat);
            tempMat.invert();
            tempMat.scale(1.0 / orig.width, 1.0 / orig.height);
            tempMat.translate(anchor.x, anchor.y);
            tempMat.prepend(tex.transform.mapCoord);
            if (!this.maskVertexData) {
                this.maskVertexData = new Float32Array(8);
            }
            var vertexData = this.vertexData;
            var maskVertexData = this.maskVertexData;
            for (var i = 0; i < 8; i += 2) {
                maskVertexData[i] = vertexData[i] * tempMat.a + vertexData[i + 1] * tempMat.c + tempMat.tx;
                maskVertexData[i + 1] = vertexData[i] * tempMat.b + vertexData[i + 1] * tempMat.d + tempMat.ty;
            }
        };
        return Sprite;
    }(PIXI.Sprite));
    pixi_heaven.Sprite = Sprite;
})(pixi_heaven || (pixi_heaven = {}));
var pixi_heaven;
(function (pixi_heaven) {
    var MultiTextureSpriteRenderer = pixi_heaven.webgl.MultiTextureSpriteRenderer;
    var SpriteHeavenRenderer = (function (_super) {
        __extends(SpriteHeavenRenderer, _super);
        function SpriteHeavenRenderer() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.shaderVert = "precision highp float;\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec4 aLight, aDark;\nattribute float aTextureId;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vLight, vDark;\nvarying float vTextureId;\n\nvoid main(void){\n    gl_Position.xyw = projectionMatrix * vec3(aVertexPosition, 1.0);\n    gl_Position.z = 0.0;\n    \n    vTextureCoord = aTextureCoord;\n    vTextureId = aTextureId;\n    vLight = aLight;\n    vDark = aDark;\n}\n";
            _this.shaderFrag = "\nvarying vec2 vTextureCoord;\nvarying vec4 vLight, vDark;\nvarying float vTextureId;\nuniform sampler2D uSamplers[%count%];\n\nvoid main(void) {\nvec4 texColor;\nvec2 texCoord = vTextureCoord;\nfloat textureId = floor(vTextureId+0.5);\n%forloop%\ngl_FragColor.a = texColor.a * vLight.a;\ngl_FragColor.rgb = ((texColor.a - 1.0) * vDark.a + 1.0 - texColor.rgb) * vDark.rgb + texColor.rgb * vLight.rgb;\n}";
            return _this;
        }
        SpriteHeavenRenderer.prototype.createVao = function (vertexBuffer) {
            var attrs = this.shader.attributes;
            this.vertSize = attrs.aTextureId ? 6 : 5;
            this.vertByteSize = this.vertSize * 4;
            var gl = this.renderer.gl;
            var vao = this.renderer.createVao()
                .addIndex(this.indexBuffer)
                .addAttribute(vertexBuffer, attrs.aVertexPosition, gl.FLOAT, false, this.vertByteSize, 0)
                .addAttribute(vertexBuffer, attrs.aTextureCoord, gl.UNSIGNED_SHORT, true, this.vertByteSize, 2 * 4)
                .addAttribute(vertexBuffer, attrs.aLight, gl.UNSIGNED_BYTE, true, this.vertByteSize, 3 * 4)
                .addAttribute(vertexBuffer, attrs.aDark, gl.UNSIGNED_BYTE, true, this.vertByteSize, 4 * 4);
            if (attrs.aTextureId) {
                vao.addAttribute(vertexBuffer, attrs.aTextureId, gl.FLOAT, false, this.vertByteSize, 5 * 4);
            }
            return vao;
        };
        SpriteHeavenRenderer.prototype.fillVertices = function (float32View, uint32View, index, sprite, textureId) {
            var vertexData = sprite.vertexData;
            var uvs = sprite._texture._uvs.uvsUint32;
            var n = vertexData.length / 2;
            var lightRgba = sprite.color.lightRgba;
            var darkRgba = sprite.color.darkRgba;
            var stride = this.vertSize;
            var oldIndex = index;
            for (var i = 0; i < n; i++) {
                float32View[index] = vertexData[i * 2];
                float32View[index + 1] = vertexData[i * 2 + 1];
                uint32View[index + 2] = uvs[i];
                uint32View[index + 3] = lightRgba;
                uint32View[index + 4] = darkRgba;
                index += stride;
            }
            if (stride === 6) {
                index = oldIndex + 5;
                for (var i = 0; i < n; i++) {
                    float32View[index] = textureId;
                    index += stride;
                }
            }
        };
        return SpriteHeavenRenderer;
    }(MultiTextureSpriteRenderer));
    PIXI.WebGLRenderer.registerPlugin('spriteHeaven', SpriteHeavenRenderer);
})(pixi_heaven || (pixi_heaven = {}));
var pixi_heaven;
(function (pixi_heaven) {
    var webgl;
    (function (webgl) {
        var MultiTextureSpriteRenderer = pixi_heaven.webgl.MultiTextureSpriteRenderer;
        var GLBuffer = PIXI.glCore.GLBuffer;
        var settings = PIXI.settings;
        var premultiplyBlendMode = PIXI.utils.premultiplyBlendMode;
        var tempArray = new Float32Array([0, 0, 0, 0]);
        var SpriteMaskedRenderer = (function (_super) {
            __extends(SpriteMaskedRenderer, _super);
            function SpriteMaskedRenderer() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.shaderVert = "precision highp float;\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec4 aLight, aDark;\nattribute float aTextureId;\nattribute vec2 aMaskCoord;\nattribute vec4 aMaskClamp;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vLight, vDark;\nvarying float vTextureId;\nvarying vec2 vMaskCoord;\nvarying vec4 vMaskClamp;\n\nvoid main(void){\n    gl_Position.xyw = projectionMatrix * vec3(aVertexPosition, 1.0);\n    gl_Position.z = 0.0;\n    \n    vTextureCoord = aTextureCoord;\n    vLight = aLight;\n    vDark = aDark;\n    vTextureId = aTextureId;\n    vMaskCoord = aMaskCoord;\n    vMaskClamp = aMaskClamp;\n}\n";
                _this.shaderFrag = "\nvarying vec2 vTextureCoord;\nvarying vec4 vLight, vDark;\nvarying float vTextureId;\nvarying vec2 vMaskCoord;\nvarying vec4 vMaskClamp;\nuniform sampler2D uSamplers[2];\nuniform sampler2D uMask;\n\nvoid main(void) {\nvec4 texColor = texture2D(uSamplers[0], vTextureCoord);\n\nfloat clip = step(3.5,\n    step(vMaskClamp.x, vMaskCoord.x) +\n    step(vMaskClamp.y, vMaskCoord.y) +\n    step(vMaskCoord.x, vMaskClamp.z) +\n    step(vMaskCoord.y, vMaskClamp.w));\n\nvec4 maskColor = texture2D(uSamplers[1], vMaskCoord);\n\nvec2 texCoord = vTextureCoord;\nvec4 fragColor;\nfragColor.a = texColor.a * vLight.a;\nfragColor.rgb = ((texColor.a - 1.0) * vDark.a + 1.0 - texColor.rgb) * vDark.rgb + texColor.rgb * vLight.rgb;\ngl_FragColor = fragColor * (vTextureId * (maskColor.a * maskColor.r * clip) + 1.0 - vTextureId);\n}";
                return _this;
            }
            SpriteMaskedRenderer.prototype.createVao = function (vertexBuffer) {
                var attrs = this.shader.attributes;
                this.vertSize = 12;
                this.vertByteSize = this.vertSize * 4;
                var gl = this.renderer.gl;
                var vao = this.renderer.createVao()
                    .addIndex(this.indexBuffer)
                    .addAttribute(vertexBuffer, attrs.aVertexPosition, gl.FLOAT, false, this.vertByteSize, 0)
                    .addAttribute(vertexBuffer, attrs.aTextureCoord, gl.UNSIGNED_SHORT, true, this.vertByteSize, 2 * 4)
                    .addAttribute(vertexBuffer, attrs.aLight, gl.UNSIGNED_BYTE, true, this.vertByteSize, 3 * 4)
                    .addAttribute(vertexBuffer, attrs.aDark, gl.UNSIGNED_BYTE, true, this.vertByteSize, 4 * 4)
                    .addAttribute(vertexBuffer, attrs.aTextureId, gl.FLOAT, false, this.vertByteSize, 5 * 4)
                    .addAttribute(vertexBuffer, attrs.aMaskCoord, gl.FLOAT, false, this.vertByteSize, 6 * 4)
                    .addAttribute(vertexBuffer, attrs.aMaskClamp, gl.FLOAT, false, this.vertByteSize, 8 * 4);
                return vao;
            };
            SpriteMaskedRenderer.prototype.fillVertices = function (float32View, uint32View, index, sprite, textureId) {
                var vertexData = sprite.vertexData;
                var uvs = sprite._texture._uvs.uvsUint32;
                var n = vertexData.length / 2;
                var lightRgba = sprite.color.lightRgba;
                var darkRgba = sprite.color.darkRgba;
                var stride = this.vertSize;
                var mask = sprite.maskSprite;
                var clamp = tempArray;
                var maskVertexData = tempArray;
                if (mask) {
                    sprite.calculateMaskVertices();
                    clamp = mask._texture.transform.uClampFrame;
                    maskVertexData = sprite.maskVertexData;
                }
                for (var i = 0; i < n; i++) {
                    float32View[index] = vertexData[i * 2];
                    float32View[index + 1] = vertexData[i * 2 + 1];
                    uint32View[index + 2] = uvs[i];
                    uint32View[index + 3] = lightRgba;
                    uint32View[index + 4] = darkRgba;
                    float32View[index + 5] = mask ? 1 : 0;
                    float32View[index + 6] = maskVertexData[i * 2];
                    float32View[index + 7] = maskVertexData[i * 2 + 1];
                    float32View[index + 8] = clamp[0];
                    float32View[index + 9] = clamp[1];
                    float32View[index + 10] = clamp[2];
                    float32View[index + 11] = clamp[3];
                    index += stride;
                }
            };
            SpriteMaskedRenderer.prototype.flush = function () {
                if (this.currentIndex === 0) {
                    return;
                }
                var gl = this.renderer.gl;
                var MAX_TEXTURES = this.MAX_TEXTURES;
                var np2 = pixi_heaven.utils.nextPow2(this.currentIndex);
                var log2 = pixi_heaven.utils.log2(np2);
                var buffer = this.buffers[log2];
                var sprites = this.sprites;
                var groups = this.groups;
                var float32View = buffer.float32View;
                var uint32View = buffer.uint32View;
                var index = 0;
                var nextTexture, nextMaskTexture;
                var currentTexture = null, currentMaskTexture = null;
                var currentUniforms = null;
                var groupCount = 1;
                var textureCount = 0;
                var currentGroup = groups[0];
                var blendMode = premultiplyBlendMode[sprites[0]._texture.baseTexture.premultipliedAlpha ? 1 : 0][sprites[0].blendMode];
                currentGroup.textureCount = 0;
                currentGroup.start = 0;
                currentGroup.blend = blendMode;
                var i;
                for (i = 0; i < this.currentIndex; ++i) {
                    var sprite = sprites[i];
                    nextTexture = sprite.texture.baseTexture;
                    nextMaskTexture = null;
                    if (sprite.maskSprite) {
                        sprite.calculateMaskVertices();
                        nextMaskTexture = sprite.maskSprite.texture.baseTexture;
                        if (currentMaskTexture === null) {
                            currentMaskTexture = nextMaskTexture;
                            currentGroup.textures[1] = nextMaskTexture;
                        }
                        else {
                            currentTexture = null;
                            currentMaskTexture = null;
                            textureCount = MAX_TEXTURES;
                        }
                    }
                    var spriteBlendMode = premultiplyBlendMode[Number(nextTexture.premultipliedAlpha)][sprite.blendMode];
                    if (blendMode !== spriteBlendMode) {
                        blendMode = spriteBlendMode;
                        currentTexture = null;
                        currentMaskTexture = null;
                        textureCount = MAX_TEXTURES;
                    }
                    var uniforms = this.getUniforms(sprite);
                    if (currentUniforms !== uniforms) {
                        currentUniforms = uniforms;
                        currentTexture = null;
                        currentMaskTexture = null;
                        textureCount = MAX_TEXTURES;
                    }
                    if (currentTexture !== nextTexture) {
                        currentTexture = nextTexture;
                        currentMaskTexture = nextMaskTexture;
                        if (textureCount === MAX_TEXTURES) {
                            textureCount = 0;
                            currentGroup.size = i - currentGroup.start;
                            currentGroup = groups[groupCount++];
                            currentGroup.textureCount = 0;
                            currentGroup.blend = blendMode;
                            currentGroup.start = i;
                            currentGroup.uniforms = currentUniforms;
                        }
                        nextTexture._virtalBoundId = textureCount;
                        currentGroup.textureCount = MAX_TEXTURES;
                        currentGroup.textures[0] = nextTexture;
                        currentGroup.textures[1] = nextMaskTexture || PIXI.Texture.WHITE.baseTexture;
                        textureCount = MAX_TEXTURES;
                    }
                    this.fillVertices(float32View, uint32View, index, sprite, nextTexture._virtalBoundId);
                    index += this.vertSize * 4;
                }
                currentGroup.size = i - currentGroup.start;
                if (!settings.CAN_UPLOAD_SAME_BUFFER) {
                    if (this.vaoMax <= this.vertexCount) {
                        this.vaoMax++;
                        var attrs = this.shader.attributes;
                        var vertexBuffer = this.vertexBuffers[this.vertexCount] = GLBuffer.createVertexBuffer(gl, null, gl.STREAM_DRAW);
                        this.vaos[this.vertexCount] = this.createVao(vertexBuffer);
                    }
                    this.renderer.bindVao(this.vaos[this.vertexCount]);
                    this.vertexBuffers[this.vertexCount].upload(buffer.vertices, 0, false);
                    this.vertexCount++;
                }
                else {
                    this.vertexBuffers[this.vertexCount].upload(buffer.vertices, 0, true);
                }
                currentUniforms = null;
                for (i = 0; i < groupCount; i++) {
                    var group = groups[i];
                    var groupTextureCount = 2;
                    if (group.uniforms !== currentUniforms) {
                        this.syncUniforms(group.uniforms);
                    }
                    for (var j = 0; j < groupTextureCount; j++) {
                        this.renderer.bindTexture(group.textures[j], j, true);
                        group.textures[j]._virtalBoundId = -1;
                        var v = this.shader.uniforms.samplerSize;
                        if (v) {
                            v[0] = group.textures[j].realWidth;
                            v[1] = group.textures[j].realHeight;
                            this.shader.uniforms.samplerSize = v;
                        }
                    }
                    this.renderer.state.setBlendMode(group.blend);
                    gl.drawElements(gl.TRIANGLES, group.size * 6, gl.UNSIGNED_SHORT, group.start * 6 * 2);
                }
                this.currentIndex = 0;
            };
            SpriteMaskedRenderer.prototype.genShader = function () {
                var gl = this.renderer.gl;
                this.MAX_TEXTURES = 2;
                this.shader = webgl.generateMultiTextureShader(this.shaderVert, this.shaderFrag, gl, this.MAX_TEXTURES);
            };
            return SpriteMaskedRenderer;
        }(MultiTextureSpriteRenderer));
        PIXI.WebGLRenderer.registerPlugin('spriteMasked', SpriteMaskedRenderer);
    })(webgl = pixi_heaven.webgl || (pixi_heaven.webgl = {}));
})(pixi_heaven || (pixi_heaven = {}));
var pixi_heaven;
(function (pixi_heaven) {
    var SpriteModel = (function () {
        function SpriteModel() {
        }
        return SpriteModel;
    }());
    pixi_heaven.SpriteModel = SpriteModel;
})(pixi_heaven || (pixi_heaven = {}));
var pixi_heaven;
(function (pixi_heaven) {
    var spine;
    (function (spine_1) {
        var Spine = (function (_super) {
            __extends(Spine, _super);
            function Spine(spineData) {
                var _this = _super.call(this, spineData) || this;
                _this.hasSpriteMask = false;
                _this.color = new pixi_heaven.ColorTransform();
                return _this;
            }
            Spine.prototype.newSprite = function (tex) {
                return new SpineSprite(tex, this);
            };
            return Spine;
        }(PIXI.spine.Spine));
        spine_1.Spine = Spine;
        var SpineSprite = (function (_super) {
            __extends(SpineSprite, _super);
            function SpineSprite(tex, spine) {
                var _this = _super.call(this, tex) || this;
                _this.region = null;
                _this.spine = spine;
                return _this;
            }
            SpineSprite.prototype._renderWebGL = function (renderer) {
                if (this.maskSprite) {
                    this.spine.hasSpriteMask = true;
                }
                if (this.spine.hasSpriteMask) {
                    this.pluginName = 'spriteMasked';
                }
                _super.prototype._renderWebGL.call(this, renderer);
            };
            return SpineSprite;
        }(pixi_heaven.Sprite));
        spine_1.SpineSprite = SpineSprite;
    })(spine = pixi_heaven.spine || (pixi_heaven.spine = {}));
})(pixi_heaven || (pixi_heaven = {}));
//# sourceMappingURL=pixi-heaven.js.map
define("Neu/PIXIPlugins/AnimClip", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Created by MSI on 18.10.2017.
     */
    var AnimClip = /** @class */ (function (_super) {
        __extends(AnimClip, _super);
        function AnimClip(textures, autoUpdate) {
            var _this = _super.call(this, textures) || this;
            _this.endFrame = 0;
            _this.startFrame = 0;
            _this.convertToHeaven();
            _this.endFrame = textures.length - 1;
            _this.startFrame = 0;
            return _this;
        }
        Object.defineProperty(AnimClip.prototype, "currentFrame", {
            get: function () {
                if (isNaN(this._currentTime))
                    return this.startFrame;
                var currentFrame = this.startFrame + Math.floor(this._currentTime) % (this.endFrame - this.startFrame + 1);
                if (currentFrame < 0) {
                    currentFrame += this._textures.length;
                }
                return isNaN(currentFrame) ? 1 : currentFrame;
            },
            enumerable: true,
            configurable: true
        });
        AnimClip.prototype.loopFromTo = function (startFrame, endFrame) {
            this.endFrame = endFrame;
            this.startFrame = startFrame;
            if (startFrame == endFrame) {
                this.loop = false;
                this.gotoAndStop(startFrame);
            }
            else {
                this.loop = true;
                this.gotoAndPlay(this.startFrame);
            }
        };
        return AnimClip;
    }(PIXI.extras.AnimatedSprite));
    exports.AnimClip = AnimClip;
});
/**
 * Created by Михаил on 27.06.2014.
 */
define("Neu/Math", ["require", "exports", "main"], function (require, exports, main_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LoadQueue = /** @class */ (function () {
        function LoadQueue(cb) {
            this.total = 0;
            this.onEnd = cb;
        }
        LoadQueue.prototype.onLoad = function () {
            var _this = this;
            var any = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                any[_i] = arguments[_i];
            }
            this.total++;
            return function () {
                _this.total--;
                if (_this.total == 0) {
                    _this.onEnd();
                }
            };
        };
        return LoadQueue;
    }());
    exports.LoadQueue = LoadQueue;
    function binarySearch(array, target, comparator) {
        var l = 0, h = array.length - 1, m, comparison;
        comparator = comparator || function (a, b) {
            return (a < b ? -1 : (a > b ? 1 : 0)); /* default comparison method if one was not provided */
        };
        while (l <= h) {
            m = (l + h) >>> 1; /* equivalent to Math.floor((l + h) / 2) but faster */
            comparison = comparator(array[m], target);
            if (comparison < 0) {
                l = m + 1;
            }
            else if (comparison > 0) {
                h = m - 1;
            }
            else {
                return m;
            }
        }
        return ~l;
    }
    exports.binarySearch = binarySearch;
    function binaryInsert(array, target, duplicate, comparator) {
        var i = binarySearch(array, target, comparator);
        if (i >= 0) { /* if the binarySearch return value was zero or positive, a matching object was found */
            if (!duplicate) {
                return i;
            }
        }
        else { /* if the return value was negative, the bitwise complement of the return value is the correct index for this object */
            i = ~i;
        }
        array.splice(i, 0, target);
        return i;
    }
    exports.binaryInsert = binaryInsert;
    var M = /** @class */ (function () {
        function M() {
        }
        M.prototype.ARGBtoRGB = function (arg0) {
            return [arg0[1], arg0[2], arg0[3]];
        };
        M.prototype.v2cp = function (v) {
            return [v[0], v[1]];
        };
        M.prototype.perp = function (v) {
            return [-v[1], v[0]];
        };
        M.prototype.dot = function (v1, v2) {
            return v1[0] * v2[0] + v1[1] * v2[1];
        };
        M.prototype.v2len = function (v) {
            return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
        };
        M.prototype.subv2 = function (v1, v2) {
            return [v1[0] - v2[0], v1[1] - v2[1]];
        };
        M.prototype.v2prod = function (v1, v2) {
            return [v1[0] * v2[0], v1[1] * v2[1]];
        };
        M.prototype.av2 = function (v, v2) {
            return [v[0] + v2[0], v[1] + v2[1]];
        };
        M.prototype.mv2 = function (v, delta) {
            return [v[0] * delta, v[1] * delta];
        };
        M.prototype.normalizeV2 = function (v) {
            var l = Math.sqrt(v[0] * v[0] + v[1] * v[1]) + 0.0000001;
            v[0] /= l;
            v[1] /= l;
            return v;
        };
        M.prototype.shuffle = function (a) {
            var _a;
            for (var i = a.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                _a = [a[j], a[i]], a[i] = _a[0], a[j] = _a[1];
            }
            return a;
        };
        /*  numhexToRgbNormal(numhex: number): RGBColor{
              let r = numhex >> 16;
              let g = numhex >> 8 & 0xFF;
              let b = numhex & 0xFF;
              return [r / 255.,g / 255.,b / 255.];
          }*/
        M.prototype.decimalAdjust = function (type, value, exp) {
            // Если степень не определена, либо равна нулю...
            if (typeof exp === 'undefined' || +exp === 0) {
                return Math[type](value);
            }
            value = +value;
            exp = +exp;
            // Если значение не является числом, либо степень не является целым числом...
            if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
                return NaN;
            }
            // Сдвиг разрядов
            value = value.toString().split('e');
            value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
            // Обратный сдвиг
            value = value.toString().split('e');
            return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
        };
        M.prototype.rv2 = function (v, r) {
            var ca = Math.cos(r);
            var sa = Math.sin(r);
            return [ca * v[0] - sa * v[1], sa * v[0] + ca * v[1]];
        };
        M.prototype.round10 = function (value, exp) {
            if (exp === void 0) { exp = -1; }
            return this.decimalAdjust('round', value, exp);
        };
        M.prototype.lerp = function (a, b, d) {
            return a + (b - a) * d;
        };
        M.prototype.sign = function (v) {
            if (v == 0)
                return 0;
            if (v > 0)
                return 1;
            else
                return -1;
        };
        M.prototype.rint = function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        M.prototype.getRand = function (obj) {
            return obj[Math.floor(Math.random() * obj.length)];
        };
        M.prototype.ARGBNormal = function (a) {
            a[0] = a[0] / 255.;
            a[1] = a[1] / 255.;
            a[2] = a[2] / 255.;
            a[3] = a[3] / 255.;
            return a;
        };
        M.prototype.hexToRgb = function (hex, normal) {
            if (normal === void 0) { normal = true; }
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            var res = result ? [
                parseInt(result[1], 16),
                parseInt(result[2], 16),
                parseInt(result[3], 16),
                parseInt(result[4], 16),
            ] : null;
            if (res && normal) {
                return this.ARGBNormal(res);
            }
        };
        M.prototype.hslToRgb = function (h, s, l) {
            var r, g, b;
            if (s == 0) {
                r = g = b = l; // achromatic
            }
            else {
                var hue2rgb = function hue2rgb(p, q, t) {
                    if (t < 0)
                        t += 1;
                    if (t > 1)
                        t -= 1;
                    if (t < 1 / 6)
                        return p + (q - p) * 6 * t;
                    if (t < 1 / 2)
                        return q;
                    if (t < 2 / 3)
                        return p + (q - p) * (2 / 3 - t) * 6;
                    return p;
                };
                var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                var p = 2 * l - q;
                r = hue2rgb(p, q, h + 1 / 3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1 / 3);
            }
            return this.rgbtoint(r * 255, g * 255, b * 255); // [Math.round(r* 255), Math.round(g * 255), Math.round(b * 255)];
        };
        M.prototype.rgbtoint = function (r, g, b) {
            return ((1 << 24) + (r << 16) + (g << 8) + b);
        };
        M.prototype.getAngles = function (a, b, c) {
            // calculate the angle between ab and ac
            var angleAB = Math.atan2(b[1] - a[1], b[0] - a[0]);
            var angleAC = Math.atan2(c[1] - a[1], c[0] - a[0]);
            var angleBC = Math.atan2(b[1] - c[1], b[0] - c[0]);
            var angleA = Math.abs((angleAB - angleAC) * (180 / Math.PI));
            var angleB = Math.abs((angleAB - angleBC) * (180 / Math.PI));
            return [angleA, angleB];
        };
        M.prototype.fastSin = function (inValue) {
            // See  for graph and equations
            // https://www.desmos.com/calculator/8nkxlrmp7a
            // logic explained here : http://devmaster.net/posts/9648/fast-and-accurate-sine-cosine
            var B = 1.27323954474; // 4/pi
            var C = -0.405284734569; // -4 / (pi²)
            //return B*inValue + C * inValue*Math.abs(inValue);
            if (inValue > 0) {
                return B * inValue + C * inValue * inValue;
            }
            return B * inValue - C * inValue * inValue;
        };
        M.prototype.rectCircleColliding = function (cPos, radius, rectPos, rectSize) {
            var distX = Math.abs(cPos[0] - rectPos[0] - rectSize[0] / 2);
            var distY = Math.abs(cPos[1] - rectPos[1] - rectSize[1] / 2);
            var res = false;
            if (distX > (rectSize[0] / 2 + radius)) {
                return null;
            }
            if (distY > (rectSize[1] / 2 + radius)) {
                return null;
            }
            if (distX <= (rectSize[0] / 2)) {
                res = true;
            }
            if (!res && distY <= (rectSize[1] / 2)) {
                res = true;
            }
            if (!res) {
                var dx = distX - rectSize[0] / 2;
                var dy = distY - rectSize[1] / 2;
                if (dx * dx + dy * dy <= (radius * radius))
                    res = true;
                else
                    res = false;
            }
            if (res == true) {
                if (cPos[1] < rectPos[1])
                    return (rectPos[1] - radius) - cPos[1];
                else {
                    return (rectPos[1] + rectSize[1] + radius) - cPos[1];
                }
            }
            else
                return null;
        };
        M.prototype.mul = function (v, n) {
            return [v[0] * n, v[1] * n];
        };
        M.prototype.rv2fast = function (anchorDelta, rotation) {
            var ca = main_1._.fMath.cos(rotation);
            var sa = main_1._.fMath.sin(rotation);
            var prev0 = anchorDelta[0];
            anchorDelta[0] = ca * anchorDelta[0] - sa * anchorDelta[1];
            anchorDelta[1] = sa * prev0 + ca * anchorDelta[1];
        };
        M.prototype.r = function (v) {
            if (v === void 0) { v = 1; }
            return v * 2 * (Math.random() - 0.5);
        };
        M.prototype.sqdist = function (pos, pos2) {
            return (pos[0] - pos2[0]) * (pos[0] - pos2[0]) + (pos[1] - pos2[1]) * (pos[1] - pos2[1]);
        };
        M.prototype.radiusOver = function (pos, rad) {
            return [pos[0] + (Math.random() - 0.5) * rad, pos[1] + (Math.random() - 0.5) * rad];
        };
        M.prototype.angleDist = function (pos, dist, angle) {
            return [pos[0] + dist * main_1._.fMath.cos(angle), pos[1] + dist * main_1._.fMath.sin(angle)];
        };
        M.prototype.merge = function (dataObject, state) {
            for (var x in state) {
                if (!dataObject[x] || (typeof dataObject[x] != 'object')) {
                    dataObject[x] = state[x];
                }
                else {
                    dataObject[x] = this.merge(dataObject[x], state[x]);
                }
            }
            return dataObject;
        };
        M.prototype.strhexToRgbNormal = function (hexstr) {
            var r = parseInt(hexstr.slice(4, 6), 16), g = parseInt(hexstr.slice(6, 8), 16), b = parseInt(hexstr.slice(8, 10), 16);
            return [r / 255., g / 255., b / 255.];
        };
        return M;
    }());
    exports.m = new M();
});
define("Neu/BaseObjects/O", ["require", "exports", "Neu/Math", "../../lib/matter", "Neu/Application"], function (require, exports, Math_1, matter_1, Application_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DEF_EVENTS = {
        killed: 'killed',
        collided: 'collided',
    };
    var Collision = /** @class */ (function () {
        function Collision() {
            this.box = [0, 0];
            this.radius = 0;
            this.isCircle = true;
        }
        return Collision;
    }());
    var Context = /** @class */ (function () {
        function Context(prev, prevF) {
            this.id = 0;
            this.f = function () {
            };
            this.c = prev;
            this.id = Context.globalID;
            Context.globalID++;
            if (prevF)
                this.c.f = this.nextF(prevF);
        }
        Context.prototype.nextF = function (cb) {
            var con = this;
            return function (params) {
                //all the previous goes here
                if (con.c)
                    con.c.f.bind(con.c);
                cb(con.f, params);
            };
        };
        Context.globalID = 0;
        return Context;
    }());
    var PhysStatic = 1;
    var PhysDynamic = 2;
    var EngineEvent = /** @class */ (function () {
        function EngineEvent(e, l) {
            this.event = e;
            this.listener = l;
        }
        return EngineEvent;
    }());
    var O = /** @class */ (function () {
        function O(pos, gfx) {
            if (pos === void 0) { pos = null; }
            if (gfx === void 0) { gfx = null; }
            this.bounds = [0, 0];
            this.context = new Context(null, null);
            this.doRemove = false;
            this.pos = [0, 0];
            this.v = [0, 0];
            this.offset = [0, 0, 0]; //x y a
            this.removeable = true;
            this.av = 0;
            this.a = 0;
            this.noCameraOffset = false;
            this.alwaysVisible = false;
            this._width = 0;
            this._height = 0;
            this.createTime = 0;
            this._children = [];
            if (!pos) {
                this.pos = [0, 0];
            }
            else {
                this.pos = Math_1.m.v2cp(pos);
            }
            this.createTime = Application_1.Application.One.timer.getTimer();
            if (gfx) {
                this._gfx = gfx;
            }
            if (this.stringID) {
                Application_1.Application.One.sm.globalIds[this.stringID] = this;
            }
            Application_1.Application.One.sm.objects.push(this);
        }
        Object.defineProperty(O.prototype, "parent", {
            get: function () {
                return this._parent;
            },
            set: function (value) {
                this._parent = value;
            },
            enumerable: true,
            configurable: true
        });
        O.prototype.overlapPoint = function (p) {
            if (p[0] > this.pos[0] - this.bounds[0] / 2 &&
                p[0] < this.pos[0] + this.bounds[0] / 2 &&
                p[1] > this.pos[1] - this.bounds[1] / 2 &&
                p[1] < this.pos[1] + this.bounds[1] / 2) {
                return true;
            }
            else {
                return false;
            }
        };
        //Current O.x O.y goes to gfx offset
        O.prototype.removeChild = function (o) {
            if (this.doRemove) {
                return;
            }
            var inx = this._children.indexOf(o);
            if (~inx) {
                this._children.splice(inx, 1);
            }
        };
        O.prototype.addChild = function (o, relOffset) {
            if (relOffset === void 0) { relOffset = null; }
            if (!o.gfx || !o.gfx.addChild) {
                throw "Can't add child to object without gfx, or gfx is not a container!";
            }
            else {
                this._children.push(o);
                o.gfx.visible = true;
                O.rp(o.gfx);
                if (relOffset) {
                    o.gfx.x = relOffset[0];
                    o.gfx.y = relOffset[1];
                }
                else {
                    o.gfx.x = o.x;
                    o.gfx.y = o.y;
                }
                o.x = o.gfx.x;
                o.y = o.gfx.y;
                o._parent = this;
                this.gfx.addChild(o.gfx);
            }
        };
        O.prototype.addExtensions = function (c) {
            if (!this.compositions) {
                this.compositions = [];
            }
            this.compositions.push(c);
        };
        O.cin = function (c, pos, gfx, props) {
            if (pos === void 0) { pos = null; }
            if (gfx === void 0) { gfx = null; }
            if (props === void 0) { props = {}; }
            var res = new c(pos, gfx);
            res.init(props);
            return res;
        };
        Object.defineProperty(O.prototype, "body", {
            get: function () {
                return this._body;
            },
            set: function (value) {
                this._body = value;
                if (value) {
                    this.pos[0] = value.position.x;
                    this.pos[1] = value.position.y;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(O.prototype, "gfx", {
            get: function () {
                return this._gfx;
            },
            set: function (value) {
                this._gfx = value;
            },
            enumerable: true,
            configurable: true
        });
        O.prototype.updateLink = function (x, y) {
            this.x += x;
            this.y += y;
        };
        Object.defineProperty(O.prototype, "x", {
            get: function () {
                if (this._parent)
                    return this.gfx.x;
                return this.pos[0];
            },
            set: function (v) {
                if (this._parent) {
                    this.gfx.x = v;
                    //throw "Can't set X to embedded object <O>";
                }
                else {
                    var d = v - this.pos[0];
                    if (this.linkedObjects)
                        this.updateLinked(d, 0);
                    this.pos[0] = v;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(O.prototype, "y", {
            get: function () {
                if (this._parent)
                    return this.gfx.y;
                return this.pos[1];
            },
            set: function (v) {
                if (this._parent) {
                    this.gfx.y = v;
                    //throw "Can't set Y to embedded object <O>";
                }
                else {
                    var d = v - this.pos[1];
                    if (this.linkedObjects)
                        this.updateLinked(0, d);
                    this.pos[1] = v;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(O.prototype, "opacity", {
            get: function () {
                if (this._gfx)
                    return this._gfx.alpha;
            },
            set: function (v) {
                if (this._gfx)
                    this._gfx.alpha = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(O.prototype, "width", {
            get: function () {
                return this._width;
            },
            set: function (v) {
                this._width = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(O.prototype, "height", {
            get: function () {
                return this._height;
            },
            set: function (v) {
                this._height = v;
            },
            enumerable: true,
            configurable: true
        });
        O.prototype.intersects = function (o) {
            return ((Math.abs(o.x - this.x) < (o.width + this.width) / 2) &&
                (Math.abs(o.y - this.y) < (o.height + this.height) / 2));
        };
        /*****
        * Link object list to this
        * any this movement will move linked objects
         ***/
        O.prototype.linkObj = function () {
            var o = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                o[_i] = arguments[_i];
            }
            if (!this.linkedObjects)
                this.linkedObjects = [];
            for (var _a = 0, o_1 = o; _a < o_1.length; _a++) {
                var x = o_1[_a];
                this.linkedObjects.push(x);
            }
        };
        O.prototype.unlinkObj = function (o) {
            var inx = 0;
            for (var _i = 0, _a = this.linkedObjects; _i < _a.length; _i++) {
                var x = _a[_i];
                if (x == o) {
                    this.linkedObjects.splice(inx, 1);
                    break;
                }
                inx++;
            }
        };
        O.prototype.hasFlag = function (value, flag) {
            return ((value & flag) == value);
        };
        O.prototype.onCollide = function (b) {
        };
        O.rp = function (c) {
            if (c && c.parent) {
                var pp = c.parent;
                c.parent.removeChild(c);
            }
            return null;
        };
        O.hideList = function (list, visibility) {
            if (visibility === void 0) { visibility = false; }
            for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
                var x = list_1[_i];
                if (x.gfx)
                    x.gfx.visible = visibility;
            }
        };
        O.prototype.onDestroy = function () {
            if (this.body) {
                matter_1.Composite.remove(Application_1.Application.One.engine.world, this.body);
                this.body = null;
            }
            if (this._children) {
                for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
                    var x = _a[_i];
                    x.killNow();
                }
                this._children = null;
            }
            if (this.parent) {
                this.parent.removeChild(this);
            }
            this.layer = null;
            this.linkedObjects = [];
            this.emmit(exports.DEF_EVENTS.killed);
            if (this._gfx && this._gfx.parent) {
                O.rp(this._gfx);
                this._gfx = null;
            }
        };
        O.prototype.killNow = function () {
            this.doRemove = true;
            return null;
        };
        O.prototype.kill = function () {
            var _this = this;
            this.context = new Context(this.context, function (next) {
                _this.doRemove = true;
                next();
            });
            return this;
        };
        O.getSprite = function (texName) {
            if (texName.length > 4 && texName.charAt(texName.length - 4) != ".")
                var add = ".png";
            else
                add = "";
            var s = new Application_1.Application.One.PIXI.Sprite(Application_1.Application.One.PIXI.Texture.fromFrame(texName + add));
            s.anchor.x = 0.5;
            s.anchor.y = 0.5;
            return s;
        };
        O.prototype.updateBounds = function () {
            if (!this._gfx) {
                this.bounds = [this.width, this.height];
                return;
            }
            if (this._gfx.parent)
                this._gfx.updateTransform();
            var b = this._gfx.getBounds();
            this.bounds = [b.width, b.height];
        };
        O.prototype.init = function (props) {
            if (props === void 0) { props = null; }
            if (props) {
                if (props.color && this.gfx && this.gfx.color) {
                    this.gfx.color.tintBGR = parseInt(props.color.replace('#', '0x'));
                }
                if (props.light && this.gfx && this.gfx.color) {
                    var col = Math_1.m.hexToRgb(props.light);
                    this.gfx.color.setDark(col[1], col[2], col[3]);
                }
            }
            this.createTime = Application_1.Application.One.timer.getTimer();
            if (this._gfx && !this._parent && !this.noCameraOffset)
                Application_1.Application.One.sm.camera.updateTransform(this, this._gfx, 0, 0);
            this.updateBounds();
        };
        O.prototype.call = function (func) {
            this.context = new Context(this.context, function (next, params) {
                func(params);
                next();
            });
            return this;
        };
        O.prototype.delayedCall = function (milliseconds, func) {
            var _this = this;
            this.context = new Context(this.context, function (next, params) {
                _this.setTimeout(function () {
                    func(params);
                    next();
                }, milliseconds);
            });
            return this;
        };
        O.prototype.emmit = function (event) {
            var params = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                params[_i - 1] = arguments[_i];
            }
            var _a;
            if (!this.events)
                return;
            for (var i = 0, l = this.events.length; i < l; ++i) {
                if (this.events[i].event == event) {
                    (_a = this.events[i]).listener.apply(_a, params);
                    this.events.splice(i, 1);
                    i--;
                    l--;
                }
            }
        };
        O.prototype.on = function (event) {
            var _this = this;
            if (!this.events)
                this.events = [];
            this.context = new Context(this.context, function (next) {
                _this.events.push(new EngineEvent(event, function (p) {
                    next(p);
                }));
            });
            return this;
        };
        O.prototype.apply = function () {
            var initContext = this.context;
            var first = this.context;
            while (first.c)
                first = first.c;
            first.f(function () {
            });
            this.context = new Context(null, null);
            return initContext;
        };
        O.prototype.setTimeout = function (f, delaySecs) {
            var _this = this;
            if (delaySecs === void 0) { delaySecs = 0; }
            return Application_1.TweenMax.delayedCall(delaySecs, function () {
                if (_this.doRemove)
                    return -1;
                return f();
            });
        };
        O.prototype.setIntervalTimeout = function (f, delaySecs, timeoutSecs) {
            if (delaySecs < 0.03)
                delaySecs = 0.03;
            var ff = this.setInterval(f, delaySecs);
            Application_1.TweenMax.delayedCall(timeoutSecs, function () {
                ff = Application_1.Application.One.killTweens(ff);
            });
            return ff;
        };
        O.prototype.setInterval = function (f, delaySecs) {
            var _this = this;
            if (delaySecs === void 0) { delaySecs = 0.03; }
            if (delaySecs < 0.03)
                delaySecs = 0.03;
            var interval = new Application_1.TimelineMax({ repeat: -1 }).call(function () {
                if (_this.doRemove)
                    return Application_1.Application.One.killTweens(interval);
                return f();
            }, null, null, delaySecs);
            return interval;
        };
        O.prototype.wait = function (seconds) {
            var _this = this;
            this.context = new Context(this.context, function (next) {
                _this.setTimeout(function () {
                    next();
                }, seconds);
            });
            return this;
        };
        O.prototype.s = function (field, value) {
            var _this = this;
            var prev = this.context.f;
            this.context.f = function () {
                if (prev)
                    prev();
                _this[field] = value;
            };
            return this;
        };
        O.prototype.process = function () {
            if (!this.physType) {
                this.pos[0] += this.v[0];
                this.pos[1] += this.v[1];
            }
            if (this.av != 0)
                this.a += this.av * Application_1.Application.One.worldSpeed * Application_1.Application.One.delta;
            if (this._gfx) {
                if (!this._parent) {
                    Application_1.Application.One.sm.camera.updateTransform(this, this._gfx, 0, 0);
                }
                else {
                    this._gfx.x = this.pos[0];
                    this._gfx.y = this.pos[1];
                }
            }
        };
        O.prototype.updateLinked = function (x, y) {
            for (var _i = 0, _a = this.linkedObjects; _i < _a.length; _i++) {
                var a = _a[_i];
                a.updateLink(x, y);
            }
        };
        O.prototype.changeGfxLayer = function (layer) {
            O.rp(this.gfx);
            layer.addChild(this.gfx);
        };
        O.prototype.extendProcess = function (f) {
            var oldprocess = this.process.bind(this);
            this.process = function () {
                oldprocess();
                f();
            };
        };
        O.totop = function (cl) {
            cl.parent.setChildIndex(cl, cl.parent.children.length - 1);
        };
        O.prototype.rotateTo = function (dest, deltaAngle) {
            var dx = this.pos[0] - dest[0];
            var dy = this.pos[1] - dest[1];
            var d = Math.sqrt(dx * dx + dy * dy);
            if (d < 1)
                return;
            dx /= d;
            dy /= d;
            this.a = Math.atan2(dy, dx) + deltaAngle;
        };
        O.prototype.processCompositions = function () {
            for (var _i = 0, _a = this.compositions; _i < _a.length; _i++) {
                var c = _a[_i];
                c.process(this);
            }
        };
        O.prototype.getType = function () {
            return this.type;
        };
        return O;
    }());
    exports.O = O;
});
define("Neu/BaseObjects/Camera", ["require", "exports", "Neu/BaseObjects/O", "Neu/Math", "Neu/Application"], function (require, exports, O_1, Math_2, Application_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Camera = /** @class */ (function (_super) {
        __extends(Camera, _super);
        function Camera(pos) {
            var _this = _super.call(this, pos) || this;
            _this.deltaAngle = 0;
            _this.deltaLen = 0;
            _this.delta = [0, 0];
            _this.anchorDelta = [0, 0];
            _this.operator = false;
            _this.voX = 0;
            _this.voY = 0;
            _this.boardLU = [0, 0];
            _this.boardRD = [0, 0];
            _this._zoom = 1;
            _this.camScale = 1;
            _this._yflow = false;
            _this.zoom = 1;
            _this.removeable = false;
            _this.rect = new PIXI.Rectangle(0, 0, Application_2.Application.One.SCR_WIDTH, Application_2.Application.One.SCR_HEIGHT);
            return _this;
            //  TweenMax.to(this, 100, {x: 1000});
            //this.x += 1;
            //    let o = new O();
            //   o.updateLink = (dx: number, dy: number) => {
            //       console.log("dx:", Math.round(dx * 10) / 10, "dy:", Math.round(dy * 10) / 10);
            //   };
            // this.linkObj(o);
        }
        Object.defineProperty(Camera.prototype, "zoom", {
            get: function () {
                return this._zoom;
            },
            set: function (value) {
                this._zoom = value;
                this.layerOfsX = Application_2.Application.One.SCR_WIDTH * (1 - this._zoom) / 2;
                this.layerOfsY = Application_2.Application.One.SCR_HEIGHT * (1 - this._zoom) / 2;
                var app = Application_2.Application.One;
                app.sm.main.x = this.layerOfsX;
                app.sm.main.y = this.layerOfsY;
                app.sm.main.scale.x = value;
                app.sm.main.scale.y = value;
                app.sm.olgui.scale.x = value;
                app.sm.olgui.scale.y = value;
                app.sm.olgui.x = this.layerOfsX;
                app.sm.olgui.y = this.layerOfsY;
                app.sm.effects.scale.x = value;
                app.sm.effects.scale.y = value;
                app.sm.effects.x = this.layerOfsX;
                app.sm.effects.y = this.layerOfsY;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Camera.prototype, "yflow", {
            get: function () {
                return this._yflow;
            },
            set: function (value) {
                this._yflow = value;
                if (!value) {
                    this.baseY = null;
                }
            },
            enumerable: true,
            configurable: true
        });
        Camera.prototype.follow = function (o) {
            this.followObj = o;
        };
        Camera.prototype.makeShake = function (powerPercentage, duration) {
            Application_2.TweenMax.to(this, duration, { zoom: this.zoom * (1 + powerPercentage), yoyo: true, repeat: 1, ease: Application_2.Power2.easeOut });
        };
        Camera.prototype.stop = function () {
            this.v[0] = 0;
            this.v[1] = 0;
        };
        Camera.prototype.t = function (oldP) {
            return [oldP[0] - this.pos[0], oldP[1] - this.pos[1]];
        };
        Camera.prototype.onDestroy = function () {
            _super.prototype.onDestroy.call(this);
            this.followObj = null;
        };
        Camera.prototype.boundaryCheck = function (p) {
            if (p[0] < this.boardLU[0]) {
                p[0] = this.boardLU[0];
            }
            if (p[1] < this.boardLU[1]) {
                p[1] = this.boardLU[1];
            }
            if (p[0] > this.boardRD[0]) {
                p[0] = this.boardRD[0];
            }
            if (p[1] > this.boardRD[1]) {
                p[1] = this.boardRD[1];
            }
        };
        Camera.prototype.reset = function (x, y, doBoundaryCheck) {
            this.v[0] = 0;
            this.v[1] = 0;
            this.followObj = null;
            this.pos[0] = x;
            this.pos[1] = y;
            /*if (doBoundaryCheck) {
                this.boundaryCheck(this.pos)
            }*/
            this.voX = 0;
            this.voY = 0;
        };
        Camera.prototype.worldToScreen = function (s) {
            var centrObjCoordX = this.pos[0] - Application_2.Application.One.SCR_WIDTH * 0.5;
            var centrObjCoordY = this.pos[1] - Application_2.Application.One.SCR_HEIGHT * 0.5;
            return [s[0] - centrObjCoordX, s[1] - centrObjCoordY];
        };
        Camera.prototype.screenToWorld = function (s) {
            var centrObjCoordX = this.pos[0] - Application_2.Application.One.SCR_WIDTH * 0.5;
            var centrObjCoordY = this.pos[1] - Application_2.Application.One.SCR_HEIGHT * 0.5;
            return [s[0] + centrObjCoordX, s[1] + centrObjCoordY];
        };
        Camera.prototype.focusPlace = function (worldPos) {
            var app = Application_2.Application.One;
            var prevPos = [this.pos[0], this.pos[1]];
            Application_2.TweenMax.killChildTweensOf(app.sm.camera, true);
            Application_2.TweenMax.killChildTweensOf(this, true);
            console.log("FOCUS PLACE");
            new Application_2.TweenMax(this, .6, { x: worldPos[0], y: worldPos[1] });
            new Application_2.TweenMax(app.sm.camera, .6, { z: 20 });
            new Application_2.TweenMax(this, 0.5, { delay: 0.6, x: prevPos[0], y: prevPos[1] });
            new Application_2.TweenMax(app.sm.camera, 0.5, { delay: 0.6, z: 0 });
        };
        Camera.prototype.updateTransform = function (obj, clip, offsX, offsY) {
            if (offsX === void 0) { offsX = 0; }
            if (offsY === void 0) { offsY = 0; }
            if (obj.noCameraOffset) {
                clip.x = obj.pos[0] + offsX;
                clip.y = obj.pos[1] + offsY;
            }
            else {
                clip.x = obj.pos[0] - this.pos[0] + Application_2.Application.One.SCR_WIDTH_HALF;
                clip.y = obj.pos[1] - this.pos[1] + Application_2.Application.One.SCR_HEIGHT_HALF;
            }
            if (!obj.alwaysVisible && !obj.noCameraOffset) {
                //clip.visible = this.isVisible(clip)
            }
            if (clip.visible) {
                clip.rotation = obj.a + this.a;
            }
        };
        Camera.prototype.offsetX = function () {
            return this.pos[0] - Application_2.Application.One.SCR_WIDTH_HALF;
        };
        Camera.prototype.offsetY = function () {
            return this.pos[1] - Application_2.Application.One.SCR_HEIGHT_HALF;
        };
        Camera.prototype.process = function () {
            //    this.x += 1;
            //console.log(this.x);
        };
        Camera.prototype.isVisible = function (g) {
            g.getBounds(false, this.rect);
            var gg = g;
            if (gg.anchor && gg.anchor.x != 0.5 && gg.anchor.y != 0.5) {
                this.anchorDelta[0] = (gg.anchor.x - 0.5) * gg.width;
                this.anchorDelta[1] = (gg.anchor.y - 0.5) * gg.height;
                Math_2.m.rv2fast(this.anchorDelta, g.rotation);
            }
            else {
                this.anchorDelta[0] = 0;
                this.anchorDelta[1] = 0;
            }
            return ((Math.abs(g.position.x - Application_2.Application.One.SCR_WIDTH_HALF - this.anchorDelta[0]) <= this.rect.width + Application_2.Application.One.SCR_WIDTH_HALF / this._zoom) && (Math.abs(g.position.y - Application_2.Application.One.SCR_HEIGHT_HALF - this.anchorDelta[1]) <= this.rect.height + Application_2.Application.One.SCR_HEIGHT_HALF / this._zoom));
        };
        Camera.prototype.hitAnimation = function (charPos) {
            var pos = [(charPos[0] - this.pos[0]) / 15, (charPos[1] - this.pos[1]) / 15];
            new Application_2.TweenMax(this, 0.25, { x: this.pos[0] + pos[0], zoom: 1.05, yoyo: true, repeat: 1 });
        };
        Camera.prototype.worldScreenToUI = function (p) {
            p[0] -= Application_2.Application.One.SCR_WIDTH_HALF * (1 - this.zoom);
            p[1] -= Application_2.Application.One.SCR_HEIGHT_HALF * (1 - this.zoom);
            return p;
        };
        Camera.prototype.transformPoint = function (point, dir, pos2) {
            pos2[0] = point[0] + (-this.pos[0] + Application_2.Application.One.SCR_WIDTH_HALF) * dir;
            pos2[1] = point[1] + (-this.pos[1] + Application_2.Application.One.SCR_HEIGHT_HALF) * dir;
        };
        return Camera;
    }(O_1.O));
    exports.Camera = Camera;
});
define("Neu/PIXIPlugins/HeavenBitmapText", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HeavenBitmapText = /** @class */ (function (_super) {
        __extends(HeavenBitmapText, _super);
        function HeavenBitmapText() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.color = new PIXI.heaven.ColorTransform();
            return _this;
        }
        HeavenBitmapText.prototype.updateText = function () {
            for (var _i = 0, _a = this._glyphs; _i < _a.length; _i++) {
                var x = _a[_i];
                var anyx = x;
                if (!anyx.color) {
                    anyx.convertToHeaven();
                    anyx.color = this.color;
                }
            }
            _super.prototype.updateText.call(this);
            for (var _b = 0, _c = this._glyphs; _b < _c.length; _b++) {
                var x = _c[_b];
                var anyx = x;
                if (!anyx.color) {
                    anyx.convertToHeaven();
                    anyx.color = this.color;
                }
            }
        };
        return HeavenBitmapText;
    }(PIXI.extras.BitmapText));
    exports.HeavenBitmapText = HeavenBitmapText;
});
define("Neu/BaseObjects/IO", ["require", "exports", "main", "Neu/BaseObjects/O"], function (require, exports, main_2, O_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var IO = /** @class */ (function (_super) {
        __extends(IO, _super);
        function IO() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._fontScale = 1;
            _this.fontInitialSize = 20;
            _this.enabled = true;
            _this.textFieldOffsetX = 0;
            _this.textFieldOffsetY = 0;
            _this.hoverMode = false;
            _this.soundName = "click2";
            return _this;
        }
        Object.defineProperty(IO.prototype, "fontScale", {
            get: function () {
                return this._fontScale;
            },
            set: function (value) {
                if (this.doRemove)
                    return;
                this._fontScale = value;
                var f = this.textField.font;
                f.size = this.fontInitialSize * value;
                var tf = this.textField;
                this.text = this.text;
                tf.updateText();
            },
            enumerable: true,
            configurable: true
        });
        IO.prototype.toggleHoverAnimation = function (mode) {
            this.hoverMode = mode;
        };
        IO.prototype.enable = function (mode) {
            this.enabled = mode;
            if (mode) {
                this.toggleHoverAnimation(this.hoverMode);
                if (this.gfx instanceof PIXI.heaven.Sprite) {
                    this.gfx.color.setLight(1, 1, 1);
                }
            }
            else {
                this.toggleHoverAnimation(false);
                if (this.gfx instanceof PIXI.heaven.Sprite) {
                    this.gfx.color.setLight(0.5, 0.5, 0.5);
                }
            }
        };
        IO.prototype.setFocus = function (v) {
            this.focusGfx.visible = v;
            this.focused = v;
        };
        IO.prototype.getFocus = function () {
            return this.focused;
        };
        Object.defineProperty(IO.prototype, "text", {
            get: function () {
                return this._text;
            },
            set: function (value) {
                this._text = value;
                if (this.textField) {
                    this.textField.text = this._text;
                    var tf = this.textField;
                    tf.updateText();
                    var b = this.textField.getLocalBounds();
                    if (this.valign == 'center') {
                        this.textField.y = 0 + this.textFieldOffsetY - this.textField.textHeight / 2;
                    }
                    else {
                        this.textField.y = -this.textField.maxLineHeight + this.textField.textHeight / 2 + this.textFieldOffsetY;
                    }
                    if (this.align == "right") {
                        this.textField.x = this.width - b.width / 2 + this.textFieldOffsetX;
                    }
                    else if (this.align == "left") {
                        this.textField.x = this.textField.textWidth / 2 + this.textFieldOffsetX;
                    }
                    else {
                        this.textField.x = this.width / 2 + this.textFieldOffsetX; //-b.width / 2;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(IO.prototype, "click", {
            get: function () {
                return this._click;
            },
            set: function (v) {
                var _this = this;
                this._click = v;
                if (!v) {
                    this.gfx.tap = null;
                    this.gfx.click = null;
                }
                else if (this.gfx) {
                    var a = function (evt) {
                        if (_this.enabled) {
                            main_2._.sound.play(_this.soundName);
                            v(evt);
                        }
                    };
                    this.gfx.tap = a;
                    this.gfx.click = a;
                }
            },
            enumerable: true,
            configurable: true
        });
        IO.prototype.init = function (props) {
            this.noCameraOffset = true;
            this.valign = (props && props.valign) ? props.valign : 'center';
            _super.prototype.init.call(this, props);
            //        let spr1 = _.cs('Clock_Red.png');
            //      let spr2 = _.cs('Clock_Red.png');
            //    spr1.scale.x = .33;
            //  spr1.scale.y = .33;
            //  spr2.scale.x = .33;
            //  spr2.scale.y = .33;
            //  spr1.x = -75;
            //  spr2.x = 75;
            if (props && props.align)
                this.align = props.align;
            else {
                this.align = "center";
            }
            this.focusGfx = new PIXI.Container();
            //    this.focusGfx.addChild(spr1);
            //    this.focusGfx.addChild(spr2);
            this.setFocus(false);
            this.gfx.addChild(this.focusGfx);
        };
        IO.prototype.onDestroy = function () {
            this.click = null;
            if (this.textField) {
                this.textField.parent.removeChild(this.textField);
                this.textField = null;
            }
            _super.prototype.onDestroy.call(this);
        };
        return IO;
    }(O_2.O));
    exports.IO = IO;
});
define("Neu/Stage", ["require", "exports", "main"], function (require, exports, main_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Created by MSI on 04.01.2017.
     */
    var Stage = /** @class */ (function () {
        function Stage() {
            this.currentFocus = null;
            this.focusable = [];
            this.container = new PIXI.Container();
            this.layers = {}; //MAP OF PIXI CONTAINERS
        }
        Stage.prototype.setFocusable = function (f) {
            this.focusable = f;
        };
        Stage.prototype.addControllerHandlers = function () {
            var _this = this;
            main_3._.controls.onBtnPress = function (btn) {
                if (_this.currentFocus == null) {
                    _this.currentFocus = 0;
                }
                if (btn == 1 && _this.currentFocus != null) {
                    _this.focusable[_this.currentFocus].click();
                }
            };
            main_3._.controls.onRight = function () {
                if (_this.currentFocus != null)
                    _this.focusable[_this.currentFocus].setFocus(false);
                else {
                    _this.currentFocus = 0;
                }
                _this.currentFocus = (_this.currentFocus + 1) % _this.focusable.length;
                _this.focusable[_this.currentFocus].setFocus(true);
            };
            main_3._.controls.onLeft = function () {
                if (_this.currentFocus != null)
                    _this.focusable[_this.currentFocus].setFocus(false);
                else {
                    _this.currentFocus = 0;
                }
                _this.currentFocus--; // = (this.currentFocus  1) % this.focusable.length
                if (_this.currentFocus < 0)
                    _this.currentFocus = _this.focusable.length - 1;
                _this.focusable[_this.currentFocus].setFocus(true);
            };
        };
        Stage.prototype.process = function () {
        };
        ;
        Stage.prototype.onHide = function (newStage) {
            main_3._.sm.removeObjects();
            main_3._.sm.main.removeChild(this.container);
        };
        ;
        Stage.prototype.onShow = function () {
            main_3._.sm.main.addChild(this.container);
        };
        ;
        Stage.prototype.addLayer = function (name, l) {
            if (l) {
                this.layers[name] = l;
            }
            else {
                this.layers[name] = new PIXI.Container();
            }
            this.container.addChild(this.layers[name]);
            return this.layers[name];
        };
        return Stage;
    }());
    exports.Stage = Stage;
});
define("Neu/Transitions/ITransition", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Neu/Transitions/BlackTransition", ["require", "exports", "Neu/Application", "Neu/Application"], function (require, exports, Application_3, Application_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BlackTransition = /** @class */ (function () {
        function BlackTransition() {
            this.color = 0xffffff;
        }
        BlackTransition.prototype.Run = function (prevStage, newStage) {
            var x = new PIXI.Graphics();
            x.width = Application_3.Application.One.SCR_WIDTH;
            x.height = Application_3.Application.One.SCR_HEIGHT;
            x.clear();
            x.beginFill(this.color, 1);
            x.drawRect(0, 0, Application_3.Application.One.SCR_WIDTH, Application_3.Application.One.SCR_HEIGHT);
            x.endFill();
            var c = Application_3.Application.One.cc(Application_3.Application.One.sm.superstage);
            c.addChild(x);
            c.alpha = 0;
            /*   let c2 = Application.One.cc(c);
               for (let x = 0; x < 12; x ++) {
                   let sand1 = Application.One.cs("dirtsand", c2);
                   sand1.x = Application.One.SCR_WIDTH_HALF + Math.random()*5000;
                   sand1.y = Application.One.SCR_HEIGHT_HALF + (Math.random() - 0.5)*0.8*Application.One.SCR_HEIGHT;
                   sand1.alpha  = 0.07;//.setLight(0.2, 0.2, 0.2);
                   sand1.scale.x = 20;
                   sand1.scale.y = 10;
               }*/
            Application_3.Application.One.sm.stage.doProcess = false;
            new Application_4.TweenMax(c, 0.07, {
                alpha: 1, onComplete: function () {
                    Application_3.Application.One.sm.switchStages(prevStage, newStage);
                    //   new TweenMax(c2, 0.6, {x: - 5000});
                    new Application_4.TweenMax(c, 0.2, {
                        delay: 0.4,
                        alpha: 0, onComplete: function () {
                            Application_3.Application.One.sm.superstage.removeChild(c);
                        }
                    });
                }
            });
        };
        return BlackTransition;
    }());
    exports.BlackTransition = BlackTransition;
});
define("Neu/SM", ["require", "exports", "Neu/BaseObjects/Camera", "Neu/Math", "Neu/Application", "Neu/Transitions/BlackTransition", "main"], function (require, exports, Camera_1, Math_3, Application_5, BlackTransition_1, main_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SM = /** @class */ (function () {
        function SM() {
            this.stage = null;
            this.prevStage = null;
            this.inTransit = false;
            this.loading = false;
            this.objects = [];
            this.static = [];
            this.walls = [];
            this.dynamic = [];
            this.globalIds = {};
        }
        SM.prototype.ZOrderContainer = function (c) {
            c.children.sort(function (a, b) {
                return a.position.y - b.position.y;
            });
        };
        SM.prototype.ZUpdate = function (container, c) {
            var l = Math_3.binarySearch(container.children, c, function (a, b) {
                return a.position.y - b.position.y;
            });
            if (l < 0) { // if the binarySearch return value was zero or positive, a matching object was found
                l = ~l;
            }
            container.setChildIndex(c, Math.min(l + 1, container.children.length - 1));
        };
        SM.prototype.addStatic = function (gfx) {
            this.static.push(gfx);
        };
        SM.prototype.findByProp = function (prop, list) {
            if (list === void 0) { list = null; }
            if (!list)
                list = this.objects;
            var res = [];
            for (var _i = 0, list_2 = list; _i < list_2.length; _i++) {
                var o = list_2[_i];
                if (!o.doRemove && o.properties[prop])
                    res.push(o);
            }
            return res;
        };
        SM.prototype.findMultiple = function (stringId, list) {
            if (list === void 0) { list = null; }
            if (!list)
                list = this.objects;
            var res = [];
            for (var _i = 0, list_3 = list; _i < list_3.length; _i++) {
                var o = list_3[_i];
                if (!o.doRemove && o.stringID == stringId)
                    res.push(o);
            }
            return res;
        };
        SM.prototype.findOne = function (stringId, list) {
            if (list === void 0) { list = null; }
            if (Application_5.Application.One.sm.globalIds[stringId]) {
                return Application_5.Application.One.sm.globalIds[stringId];
            }
            if (!list)
                list = this.objects;
            for (var _i = 0, list_4 = list; _i < list_4.length; _i++) {
                var o = list_4[_i];
                if (!o.doRemove && o.stringID == stringId)
                    return o;
            }
        };
        SM.prototype.findByTypeOne = function (constructor, list) {
            if (list === void 0) { list = null; }
            if (!list)
                list = this.objects;
            for (var _i = 0, list_5 = list; _i < list_5.length; _i++) {
                var o = list_5[_i];
                if (!o.doRemove && o instanceof constructor) {
                    return o;
                }
            }
            return null;
        };
        SM.prototype.findByType = function (constructor, list) {
            if (list === void 0) { list = null; }
            if (!list)
                list = this.objects;
            var res = [];
            for (var _i = 0, list_6 = list; _i < list_6.length; _i++) {
                var o = list_6[_i];
                if (!o.doRemove && o instanceof constructor) {
                    res.push(o);
                }
            }
            return res;
        };
        SM.prototype.init = function () {
            this.superstage = new PIXI.Container();
            this.bg = new PIXI.Container();
            this.main = new PIXI.Container();
            this.gui = new PIXI.Container();
            this.gui2 = new PIXI.Container();
            this.olgui = new PIXI.Container();
            this.fonts = new PIXI.Container();
            this.effects = new PIXI.Container();
            this.cursorlayer = new PIXI.Container();
            this.light = new PIXI.Container();
            this.main.interactive = false;
            this.gui.interactive = true;
            this.gui2.interactive = true;
            this.olgui.interactive = true;
            this.fonts.interactive = false;
            this.superstage.addChild(this.main);
            this.pixiUiStage = new main_4.PIXIUI.Stage(Application_5.Application.One.SCR_WIDTH, Application_5.Application.One.SCR_HEIGHT);
            this.superstage.addChild(this.pixiUiStage);
            this.superstage.addChild(this.effects);
            this.main.addChild(this.light);
            this.superstage.addChild(this.olgui);
            this.superstage.addChild(this.gui);
            this.superstage.addChild(this.gui2);
            this.superstage.addChild(this.fonts);
            this.superstage.addChild(this.cursorlayer);
            Application_5.Application.One.app.stage.addChild(this.superstage);
        };
        SM.prototype.createCamera = function () {
            this.camera = new Camera_1.Camera([Application_5.Application.One.SCR_WIDTH / 2, Application_5.Application.One.SCR_HEIGHT / 2]);
            var inx = this.objects.indexOf(this.camera);
            this.objects.splice(inx, 1);
            return this.camera;
        };
        SM.prototype.removeObjects = function () {
            var len = this.objects.length;
            for (var i = 0; i < len; i++) {
                var obji = this.objects[i];
                if (obji.removeable) {
                    obji.killNow();
                    obji.onDestroy();
                    this.objects.splice(i, 1);
                    i--;
                    len--;
                }
            }
            len = this.static.length;
            for (var i = 0; i < len; i++) {
                var gfx = this.static[i];
                gfx.parent.removeChild(gfx);
            }
            this.dynamic = [];
            this.walls = [];
            this.static = [];
        };
        SM.prototype.hideStage = function (s, next) {
            s.onHide(next);
            s.layers = {};
            s.doProcess = false;
        };
        SM.prototype.showStage = function (s) {
            s.layers = {};
            s.doProcess = true;
            this.camera.reset(Application_5.Application.One.SCR_WIDTH / 2, Application_5.Application.One.SCR_HEIGHT / 2, false);
            s.onShow();
        };
        SM.prototype.switchStages = function (cur, nw) {
            if (cur) {
                this.hideStage(cur, nw);
            }
            this.stage = nw;
            this.showStage(this.stage);
        };
        SM.prototype.fadeBegin = function (newStage) {
            this.transition = new BlackTransition_1.BlackTransition();
            this.transition.Run(this.stage, newStage);
        };
        SM.prototype.openStage = function (newStage) {
            if (this.inTransit)
                return;
            newStage.prevStage = this.stage;
            if (this.stage) {
                if (!this.stage.doProcess)
                    return;
                this.stage.doProcess = false;
                this.fadeBegin(newStage);
            }
            else {
                this.stage = newStage;
                this.stage.doProcess = true;
                newStage.onShow();
            }
        };
        SM.prototype.cleanRemoved = function () {
            var len = this.objects.length;
            for (var i = len - 1; i >= 0; i--) {
                var obji = this.objects[i];
                if (obji.doRemove) {
                    obji.onDestroy();
                    this.objects.splice(i, 1);
                    i--;
                }
            }
        };
        SM.prototype.process = function () {
            Application_5.Application.One.sm.camera.process();
            this.cleanRemoved();
            var len = this.objects.length;
            for (var i = len - 1; i >= 0; --i) {
                var obji = this.objects[i];
                if (obji.compositions && obji.compositions.length > 0)
                    obji.processCompositions();
                obji.process();
                if (Application_5.$DEBUG) {
                    if (obji.context.c != null) {
                        throw "Context chain called without apply";
                    }
                }
            }
            if (this.stage && this.stage.doProcess)
                this.stage.process();
        };
        SM.prototype.removeList = function (objects) {
            if (objects) {
                for (var _i = 0, objects_1 = objects; _i < objects_1.length; _i++) {
                    var x = objects_1[_i];
                    if (x != this.camera)
                        x.killNow();
                }
            }
            return null;
        };
        SM.prototype.collectObjectsOnLayer = function (layer, list) {
            if (list === void 0) { list = null; }
            if (!list)
                list = this.objects;
            var res = [];
            for (var _i = 0, list_7 = list; _i < list_7.length; _i++) {
                var x = list_7[_i];
                if (x.gfx && x.gfx.parent == layer) {
                    res.push(x);
                }
            }
            return res;
        };
        return SM;
    }());
    exports.SM = SM;
});
define("Neu/ResourceManager", ["require", "exports", "main"], function (require, exports, main_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Created by MSI on 08.11.2017.
     */
    var ResourceManager = /** @class */ (function () {
        function ResourceManager(animFolder) {
            this.shaders = {};
            this.spineData = {};
            this.spineLoaderListneners = {};
            this.animFolder = animFolder;
        }
        ResourceManager.prototype.requestSpine = function (spineName, cb) {
            var _this = this;
            if (this.spineData[spineName]) {
                return cb(this.spineData[spineName]);
            }
            if (!this.spineLoaderListneners[spineName]) {
                this.spineLoaderListneners[spineName] = [cb];
            }
            else {
                this.spineLoaderListneners[spineName].push(cb);
                return;
            }
            var loader = new PIXI.loaders.Loader();
            loader
                .add(spineName, this.animFolder + spineName + '.json')
                .load(function (loader, resources) {
                _this.spineData[spineName] = resources[spineName].spineData;
                for (var x in _this.spineLoaderListneners[spineName]) {
                    _this.spineLoaderListneners[spineName][x](_this.spineData[spineName]);
                }
                _this.spineLoaderListneners[spineName] = null;
            });
        };
        ResourceManager.prototype.loadAssets = function (assets, onProcess, onComplete) {
            var _this = this;
            var loader = new PIXI.loaders.Loader();
            loader.add(assets);
            loader.on('complete', function () {
                onComplete();
            });
            loader.on('progress', function (loader, evt) {
                if (evt.name.indexOf('shaders') >= 0) {
                    var result = evt.name.substring(evt.name.lastIndexOf("/") + 1);
                    _this.shaders[result] = evt.data;
                }
                if (evt.name.indexOf('/') > 0 && evt.type == PIXI.loaders.Resource.TYPE.XML) {
                    var ext = evt.name.substr(evt.name.lastIndexOf('.') + 1);
                    var result = evt.name.substring(evt.name.lastIndexOf("/") + 1);
                    result = result.substring(0, result.length - 4);
                    if (ext == 'tsx') {
                        main_5._.lm.addTileset(result, evt.data);
                    }
                    if (ext == 'tmx') {
                        main_5._.lm.add(result, evt.data);
                    }
                }
                onProcess(loader, evt);
            });
            loader.load();
        };
        return ResourceManager;
    }());
    exports.ResourceManager = ResourceManager;
});
define("Neu/shaders/ColorGradingShader", ["require", "exports", "main"], function (require, exports, main_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Filter = PIXI.Filter;
    var ColorGradingShader = /** @class */ (function (_super) {
        __extends(ColorGradingShader, _super);
        function ColorGradingShader(texturename, num) {
            var _this = this;
            var LUTSpriteTex = PIXI.Texture.fromFrame(texturename);
            LUTSpriteTex.baseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR;
            LUTSpriteTex.baseTexture.mipmap = false;
            _this = _super.call(this, main_6._.rm.shaders['default.vert'], main_6._.rm.shaders['colorgrade.frag'], {
                lut: { type: 'sampler2D', value: LUTSpriteTex },
                textureNum: { type: 'float', value: num },
            }) || this;
            _this.uniforms.lut = LUTSpriteTex;
            return _this;
        }
        return ColorGradingShader;
    }(Filter));
    exports.ColorGradingShader = ColorGradingShader;
});
define("Objects/AngryBar", ["require", "exports", "Neu/BaseObjects/O", "main"], function (require, exports, O_3, main_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AngryBar = /** @class */ (function (_super) {
        __extends(AngryBar, _super);
        function AngryBar(pos, gfx) {
            if (pos === void 0) { pos = null; }
            if (gfx === void 0) { gfx = null; }
            var _this = _super.call(this, pos, null) || this;
            _this._value = 0;
            _this.smiles = [];
            _this.gfx = main_7._.cc(main_7._.sm.gui);
            _this.value = 1;
            _this.smiles.push(main_7._.cs("smile_4_1", _this.gfx));
            _this.smiles.push(main_7._.cs("smile_3_1", _this.gfx));
            _this.smiles.push(main_7._.cs("smile_2_1", _this.gfx));
            _this.smiles.push(main_7._.cs("smile_1_1", _this.gfx));
            var inx = 0;
            for (var _i = 0, _a = _this.smiles; _i < _a.length; _i++) {
                var x = _a[_i];
                x.scale.set(0.6);
                x.x = inx * 80;
                inx++;
            }
            return _this;
        }
        Object.defineProperty(AngryBar.prototype, "value", {
            get: function () {
                return this._value;
            },
            set: function (value) {
                this._value = value;
                this.update();
                if (this._value < 0) {
                    main_7._.game.ShowResModal();
                }
            },
            enumerable: true,
            configurable: true
        });
        AngryBar.prototype.init = function (p) {
            if (this.layer) {
                O_3.O.rp(this.gfx);
                this.layer.addChild(this.gfx);
            }
            if (p.value) {
                this.value = parseFloat(p.value);
            }
        };
        AngryBar.prototype.update = function () {
            var delta = 1 / (this.smiles.length + 1);
            for (var i = 0; i < this.smiles.length; i++) {
                var x = this.smiles[i];
                if (this.value > (i + 1) * delta && this.value <= (i + 2) * delta) {
                    x.alpha = 1;
                }
                else {
                    if ((this.value > (i) * delta && this.value <= (i + 1) * delta) ||
                        (this.value > (i + 2) * delta && this.value <= (i + 3) * delta)) {
                        x.alpha = 0.5;
                    }
                    else {
                        x.alpha = 0.3;
                    }
                }
            }
            if (this.smiles.length > 0 && this.value < delta) {
                this.smiles[0].alpha = 1;
            }
        };
        return AngryBar;
    }(O_3.O));
    exports.AngryBar = AngryBar;
});
define("Neu/BaseObjects/TextBox", ["require", "exports", "Neu/BaseObjects/IO", "Neu/PIXIPlugins/HeavenBitmapText", "Neu/Application"], function (require, exports, IO_1, HeavenBitmapText_1, Application_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Created by KURWINDALLAS on 11.07.2014.
     */ ///
    var TextBox = /** @class */ (function (_super) {
        __extends(TextBox, _super);
        function TextBox() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TextBox.hashCode = function (str) {
            var hash = 0;
            for (var i = 0; i < str.length; i++) {
                hash = str.charCodeAt(i) + ((hash << 5) - hash);
            }
            return hash;
        };
        TextBox.convertSpaces = function (a) {
            var c = a.match(/==/g);
            return a.replace(/==/g, '\n');
        };
        TextBox.createTextField = function (obj, props) {
            var fontName;
            if (props.fontName) {
                fontName = props.fontName;
            }
            else {
                fontName = TextBox.DEFAULT_FONT;
            }
            obj.text = props.text;
            if (obj.text) {
                obj.text = this.convertSpaces(obj.text);
            }
            if (obj.text == undefined)
                obj.text = "";
            var pt = new HeavenBitmapText_1.HeavenBitmapText(obj.text, { font: fontName });
            pt.fontInitialSize = pt.font.size;
            if (props.fontscale && props.fontscale != '') {
                pt.font.size = pt.fontInitialSize * parseFloat(props.fontscale);
            }
            pt.y = 0;
            pt.x = 0;
            //pt.bitmap = true;
            pt.scale.x = pt.scale.y;
            if (props.fontTint != "0xffffff" && props.fontTint != undefined)
                pt.tint = parseInt(props.fontTint);
            pt.anchor.x = 0.5;
            return pt;
        };
        TextBox.prototype.process = function () {
            _super.prototype.process.call(this);
        };
        TextBox.prototype.onDestroy = function () {
            _super.prototype.onDestroy.call(this);
        };
        TextBox.prototype.init = function (props) {
            this.gfx = new PIXI.Container();
            this.pos[0] -= this.width / 2;
            this.pos[1] -= this.height / 2;
            this.noCameraOffset = true;
            _super.prototype.init.call(this, props);
            this.textField = TextBox.createTextField(this, props);
            this.fontInitialSize = this.textField.maxLineHeight;
            this.gfx.position.x = Math.round(this.gfx.position.x);
            this.gfx.position.y = Math.round(this.gfx.position.y);
            if (props.color && this.gfx) {
                this.textField.tint = parseInt(props.color.replace('#', '0x'));
            }
            this.gfx.addChild(this.textField);
            var gfx = this.layer ? this.layer : Application_6.Application.One.sm.gui;
            gfx.addChild(this.gfx);
            this.text = this.text;
        };
        return TextBox;
    }(IO_1.IO));
    exports.TextBox = TextBox;
});
define("Neu/BaseObjects/Button", ["require", "exports", "Neu/BaseObjects/IO", "Neu/PIXIPlugins/AnimClip", "Neu/BaseObjects/TextBox", "Neu/Application"], function (require, exports, IO_2, AnimClip_1, TextBox_1, Application_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UIEase = CubicBezier.config(0.46, 0.53, 0.93, 0.3);
    var CLICK_STEP = 3;
    var Button = /** @class */ (function (_super) {
        __extends(Button, _super);
        function Button() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.fadeOnMouseDown = true;
            _this.baseScale = [0, 0];
            _this.doScale = true;
            _this.clickAnimation = true;
            return _this;
        }
        Object.defineProperty(Button.prototype, "customOut", {
            get: function () {
                return this._customOut;
            },
            set: function (value) {
                this._customOut = value;
                this.toggleHoverAnimation(this.hoverMode);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "customOver", {
            get: function () {
                return this._customOver;
            },
            set: function (value) {
                this.toggleHoverAnimation(this.hoverMode);
                this._customOver = value;
            },
            enumerable: true,
            configurable: true
        });
        Button.prototype.process = function () {
            _super.prototype.process.call(this);
        };
        Button.prototype.toggleHoverAnimation = function (m) {
            _super.prototype.toggleHoverAnimation.call(this, m);
            this.gfx.mouseover = this.overAnimation.bind(this);
            this.gfx.mouseout = this.outAnimation.bind(this);
        };
        Button.prototype.overAnimation = function (evt) {
            if (this.hoverMode) {
                if (this.doScale) {
                    Application_7.TweenMax.killTweensOf(this.gfx.scale);
                    new Application_7.TweenMax(this.gfx.scale, 0.08, { y: this.baseScale[1] + 0.03, ease: UIEase });
                    new Application_7.TweenMax(this.gfx.scale, 0.08, { x: this.baseScale[0] + 0.03, ease: UIEase });
                }
            }
            if (this._customOver)
                this._customOver();
        };
        Button.prototype.outAnimation = function (evt) {
            if (this.hoverMode) {
                if (this.doScale) {
                    new Application_7.TweenMax(this.gfx.scale, 0.15, {
                        x: this.baseScale[0],
                        y: this.baseScale[1],
                        ease: Application_7.Linear.easeOut
                    });
                }
                this.resetFade();
            }
            if (this._customOut)
                this._customOut();
        };
        Button.prototype.init = function (props) {
            var _this = this;
            if (!props)
                props = { text: "", align: "center" };
            if (!this.gfx)
                this.gfx = Application_7.Application.One.cc(this.layer);
            _super.prototype.init.call(this, props);
            this.gfx.interactive = true;
            props.align = 'center';
            if (this.gfx.anchor) {
                this.gfx.anchor.x = 0.5;
                this.gfx.anchor.y = 0.5;
            }
            this.textField = TextBox_1.TextBox.createTextField(this, props);
            this.text = this.text;
            var b = this.textField.getLocalBounds();
            this.textFieldOffsetX = -this.width / 2;
            this.textFieldOffsetY = 0 - this.textField.textHeight * .25;
            if (this.gfx instanceof AnimClip_1.AnimClip)
                this.gfx.gotoAndStop(0);
            var tf = this.textField;
            var f = this.gfx;
            this.baseScale[0] = f.scale.x;
            this.baseScale[1] = f.scale.y;
            this.gfx.mousedown = function (evt) {
                if (_this.customMouseDown)
                    _this.customMouseDown();
                if (_this.hoverMode) {
                    if (_this.fadeOnMouseDown) {
                        if (_this.gfx && _this.gfx.color)
                            _this.gfx.color.setLight(0.5, 0.5, 0.5);
                        _this.textField.tint = 0x888888;
                    }
                    if (_this.clickAnimation) {
                        _this._upTween = Application_7.Application.One.killTweens(_this._upTween);
                        _this._downTween = new Application_7.TweenMax(_this, 0.1, { y: _this.y + CLICK_STEP, ease: Application_7.Linear.easeIn });
                    }
                }
            };
            this.gfx.mouseup = function (evt) {
                if (_this.customMouseUp)
                    _this.customMouseUp();
                if (_this.hoverMode) {
                    _this.resetFade();
                }
            };
            this.toggleHoverAnimation(true);
            this.gfx.addChild(this.textField);
            this.gfx.cursor = "pointer";
            this.text = this.text;
            //  this.gfx.position.x = this.x;
            //  this.gfx.position.y = this.y;
        };
        Button.prototype.onDestroy = function () {
            this._downTween = Application_7.Application.One.killTweens(this._downTween);
            this._upTween = Application_7.Application.One.killTweens(this._upTween);
            if (this.gfx) {
                this.gfx.mouseover = null;
                this.gfx.mouseout = null;
                this.gfx.mousedown = null;
            }
            _super.prototype.onDestroy.call(this);
        };
        Button.prototype.updateHitArea = function (w, h) {
            if (w === void 0) { w = null; }
            if (h === void 0) { h = null; }
            var p = this.gfx.getGlobalPosition();
            this.gfx.hitArea = new PIXI.Rectangle(-w / 2, -h / 2, w ? w : this.gfx.width, h ? h : this.gfx.height);
        };
        Button.prototype.highlight = function () {
            var _this = this;
            var loop = 0;
            if (this.__highlight)
                this.__highlight = Application_7.Application.One.killTweens(this.__highlight);
            this.__highlight = this.setInterval(function () {
                loop += 0.38;
                var angle = 0.5 * (Application_7.Application.One.fMath.cos(loop) + 1);
                _this.gfx.color.setDark(0.4 * angle, 0.3 * angle, 0.05 * angle);
                //   this.gfx.color.setLight(1,1, 0.4*angle);
            }, 0);
            this.wait(0.12).call(function () {
                _this.gfx.color.setDark(0, 0, 0);
                //  this.gfx.color.setLight(1,1,1);
                _this.__highlight = Application_7.Application.One.killTweens(_this.__highlight);
            }).apply();
        };
        Button.prototype.resetFade = function () {
            if (this.clickAnimation) {
                if (this._downTween) {
                    this._downTween = Application_7.Application.One.killTweens(this._downTween);
                    this._upTween = new Application_7.TweenMax(this, 0.1, { y: this.y - CLICK_STEP, ease: Application_7.Linear.easeOut });
                }
            }
            if (this.fadeOnMouseDown) {
                if (this.gfx && this.gfx.color)
                    this.gfx.color.setLight(1, 1, 1);
                this.textField.tint = 0xffffff;
            }
        };
        return Button;
    }(IO_2.IO));
    exports.Button = Button;
});
define("Objects/Problem", ["require", "exports", "Neu/BaseObjects/O", "main", "Neu/BaseObjects/TextBox", "Neu/Application"], function (require, exports, O_4, main_8, TextBox_2, Application_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CellHeight = 78;
    var Problem = /** @class */ (function (_super) {
        __extends(Problem, _super);
        function Problem(pos, gfx, problemType) {
            if (pos === void 0) { pos = null; }
            if (gfx === void 0) { gfx = null; }
            var _this = _super.call(this, pos, null) || this;
            _this.solutions = [];
            _this.solved = false;
            _this.toolsSolved = [];
            _this.line = 0;
            _this._bigProblem = false;
            _this.problemType = problemType;
            _this.gfx = main_8._.cc(_this.gfxBrick = new PIXI.heaven.Sprite(PIXI.Texture.WHITE));
            var lines = problemType.text.split("\n");
            _this.textField = TextBox_2.TextBox.createTextField({}, { fontscale: 0.5, align: "left", text: lines[0] });
            _this.textField.x = 14 + _this.textField.width / 2;
            _this.textField.y = 12 + -14;
            _this.textField.tint = 0x111111;
            if (lines.length > 1) {
                _this.textField2 = TextBox_2.TextBox.createTextField({}, { fontscale: 0.5, align: "left", text: lines[1] });
                _this.textField2.x = 14 + _this.textField2.width / 2;
                _this.textField2.y = 12 + 10;
                _this.textField2.tint = 0x111111;
            }
            _this.gfx.addChild(_this.gfxBrick);
            if (problemType.type == 0) {
                _this.bigProblem = true;
            }
            _this.gfx.addChild(_this.textField);
            if (_this.textField2)
                _this.gfx.addChild(_this.textField2);
            _this.gfxBrick.height = CellHeight;
            _this.gfxBrick.width = 20;
            return _this;
        }
        Problem.prototype.solveAnimation = function () {
            Application_8.TweenMax.to(this.gfx, 1.4, { alpha: 0. });
            for (var _i = 0, _a = this.toolsSolved; _i < _a.length; _i++) {
                var x = _a[_i];
                Application_8.TweenMax.to(x.gfx, 1.4, { alpha: 0. });
            }
        };
        Problem.prototype.onDestroy = function () {
            _super.prototype.onDestroy.call(this);
            this.toolsSolved = null;
        };
        Problem.prototype.dropSolution = function (s) {
            if (this.solutions.indexOf(s.solution.type) >= 0) {
                return false;
            }
            if (this.problemType.solutions.indexOf(s.solution.type) >= 0) {
                this.solutions.push(s.solution.type);
                this.toolsSolved.push(s);
                s.gfx.alpha = 1;
                s.gfx.interactive = false;
                s.gfx.y = this.y + 6 + s.gfx.height / 4;
                s.gfx.width = 80;
                s.gfx.height = 80;
                this.alignTools();
                return true;
            }
            else {
                this.wrongSolutionAnim();
                return false;
            }
        };
        Object.defineProperty(Problem.prototype, "bigProblem", {
            get: function () {
                return this._bigProblem;
            },
            set: function (value) {
                this._bigProblem = value;
                if (value) {
                    this.bigProblemSprite = main_8._.cs("icon_problembar_chp", this.gfx);
                    this.bigProblemSprite.scale.set(0.5);
                    this.bigProblemSprite.y = 35;
                    this.bigProblemSprite.x = 50;
                    this.gfxBrick.tint = 0xff4633;
                    this.gfxBrick.color.lightRgba = 0xff4633;
                }
                else {
                    this.bigProblemSprite = O_4.O.rp(this.bigProblemSprite);
                }
            },
            enumerable: true,
            configurable: true
        });
        Problem.prototype.alignTools = function () {
            var w = main_8.SCR_WIDTH - this.gfx.x;
            var inx = this.toolsSolved.length - 1;
            for (var _i = 0, _a = this.toolsSolved; _i < _a.length; _i++) {
                var x = _a[_i];
                x.gfx.x = this.gfx.x + w - 80 * inx - x.gfx.width / 2;
                inx--;
            }
        };
        Problem.prototype.failanim = function () {
            Application_8.TweenMax.to(this.gfxBrick.color, 0.05, { lightG: 0, lightB: 0, yoyo: true, repeat: 4 });
            Application_8.TweenMax.to(this.gfx, 0.9, { alpha: 0. });
            for (var _i = 0, _a = this.toolsSolved; _i < _a.length; _i++) {
                var x = _a[_i];
                Application_8.TweenMax.to(x.gfx, 0.9, { alpha: 0. });
            }
        };
        Problem.prototype.wrongSolutionAnim = function () {
            Application_8.TweenMax.to(this, 0.05, { y: this.y - 2, yoyo: true, repeat: 5 });
            Application_8.TweenMax.to(this.gfx, 0.05, { alpha: 0.8, yoyo: true, repeat: 5 });
            //TweenMax.to(this.gfx.scale, 0.05, {x: 0.97, y: 0.97, yoyo: true, repeat: 5});
        };
        return Problem;
    }(O_4.O));
    exports.Problem = Problem;
});
define("Socials", ["require", "exports", "main"], function (require, exports, main_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function vkpost(text) {
        console.log("post vk");
        function authInfo(response) {
            main_9._.game.submitScore(main_9._.game.score, 'VK:' + response.session.mid, response.session.user.first_name, response.session.user.last_name);
            if (response.session) {
                VK.api('wall.post', {
                    message: text,
                }, function (data) {
                    console.log(JSON.stringify(data));
                    if (data.response) {
                    }
                });
            }
            else {
            }
        }
        VK.Auth.login(authInfo);
    }
    exports.vkpost = vkpost;
    function okpost(t) {
        var attachtment = { "media": [
            /* {
                 "type": "link",
                 "url": LINK_SITE
             },
             {
                 "type": "text",
                 "text": "asdasdasdasd"
             },
             {
                 "type": "app",
                 "text": "Text above image",
                 "images": [
                     {
                         "url": "http://r.mradx.net/img/38/F3C336.jpg",
                         "mark": "prize_1234",
                         "title":"Hover Text!"
                     }
                 ],
                 "actions": [
                     {"text":"Hello",
                         "mark":"hello"}
                 ]

             }*/
            ]
        };
        main_9.$.post("http://www.odnoklassniki.ru/oauth/authorize?client_id=" + OK_APP_ID.toString() + "&response_type=code&redirect_uri=" + encodeURIComponent(APP_ADDRESS)).done(function (data) {
        });
        //    $.get("http://www.odnoklassniki.ru/oauth/authorize?client_id=" + OK_APP_ID.toString() +"&response_type=code&redirect_uri=" + encodeURIComponent(APP_ADDRESS)).done(( data ) => {
        //  });
        //let atStr =encodeURIComponent(JSON.stringify(attachtment));
        //let sign =  CryptoJS.MD5(encodeURIComponent("st.attachment=") + atStr + encodeURIComponent("18DAB712D1473119BC78A7E6"));
        //window.open("http://www.ok.ru/dk?st.cmd=addShare&st.s=1&st._surl=" + window.LINK_GAME +"&st.comments=" + encodeURI(t));
        //        window.open("https://connect.ok.ru/oauth/authorize?client_id=1246674688&scope=VALUABLE_ACCESS;&response_type=token&redirect_uri=http://localhost/");
        /* $.post( "https://connect.ok.ru/oauth/authorize?client_id=1246674688&scope=VALUABLE_ACCESS;&response_type=token", function( data ) {
             console;
         });*/
        /*
                window.open("http://connect.ok.ru/dk?st.cmd=WidgetMediatopicPost&" +
                        "st.app=1246674688&" +
                        "st.attachment=" + atStr +"&" +
                        "st.signature=" + sign + "&" +
                       // "st.return={return_url}&" +
                      //  "st.popup=on&" +
                      //  "st.silent={silent}&" +
                        "st.utext="+ x);
        */
    }
    exports.okpost = okpost;
    function twpost(t, img, imgNo, hash) {
        var x = encodeURI(t);
        var href = "https://twitter.com/intent/tweet?" +
            "url" + APP_ADDRESS +
            "&text=" + x + hash;
        twttr.connect(function (data) {
            console.log(data);
        });
        window.open(href);
    }
    exports.twpost = twpost;
    function fbpost() {
        FB.login(function (response) {
            var accessToken = response.authResponse.accessToken;
            FB.api('/me', 'get', { fields: "name" }, function (x) {
                main_9._.game.submitScore(main_9._.game.score, 'FB:' + x.id, x.name, "");
                FB.ui({ method: 'feed',
                    link: window.LINK_TO_SOCIAL,
                    name: "Level",
                    caption: "",
                    description: "text",
                });
            });
            // Handle the response object, like in statusChangeCallback() in our demo
            // code.
        });
        /*  attachment: {
                         name: 'Name here',
                         caption: 'Caption here.',
                         description: (
                                 'description here'
                         ),
                         href: ''
                     },*/
        /* action_links: [
             { text: 'Code', href: 'action url here' }
         ],*/
        /* FB.ui(
             {  method: 'feed',
                 link: (<any>window).LINK_GAME,
                 picture: img,
                 name: "Игра «Волки и овцы: Бе-е-е-зумное превращение»",
                 caption: "SHEEPANDWOLVES.RU/GAME",
                 description: "Играй в игру, становись участником конкурса и получи шанс выиграть крутую майку от создателей мультфильма «Волки и овцы: Бе-е-е-зумное превращение»",
     
     
             },
     
     
     
             function(response) {
                 function loadScript(url, callback){
     
                     var script = document.createElement("script")
                     script.type = "text/javascript";
     
                     if (script.readyState){  //IE
                         script.onreadystatechange = function(){
                             if (script.readyState == "loaded" ||
                                 script.readyState == "complete"){
                                 script.onreadystatechange = null;
                                 callback();
                             }
                         };
                     } else {  //Others
                         script.onload = function(){
                             ///    callback();
                         };
                     }
     
                     script.src = url;
                     document.getElementsByTagName("head")[0].appendChild(script);
                 }
     
     
     
     
                 if (response && response.post_id) {
                     alert('Post was published.');
                 } else {
                     alert('Post was not published.');
                 }
             }
         );*/
    }
    exports.fbpost = fbpost;
});
define("Stages/Menu", ["require", "exports", "Neu/Stage", "main", "Neu/BaseObjects/TextBox"], function (require, exports, Stage_1, main_10, TextBox_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.API_PHP_FILE = "http://levelgroup.ru/game.php";
    var Menu = /** @class */ (function (_super) {
        __extends(Menu, _super);
        function Menu() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Menu.prototype.addLine = function (inx, data) {
            if (main_10._.sm.stage != this)
                return;
            var tbname = new TextBox_3.TextBox([180, 580 + inx * 60]);
            tbname.init({ text: data.name + (data.lastname != "") ? (" " + data.lastname) : "" });
            var tbscore = new TextBox_3.TextBox([570, 580 + inx * 60]);
            tbscore.init({ align: "right", text: data.score.toString() });
        };
        Menu.prototype.getLeaderboard = function () {
            var _this = this;
            main_10.$.post(exports.API_PHP_FILE, { func: "leaderboard" })
                .done(function (data) {
                var d = JSON.parse(data);
                var inx = 0;
                for (var _i = 0, d_1 = d; _i < d_1.length; _i++) {
                    var x = d_1[_i];
                    if (inx > 10)
                        break;
                    _this.addLine(inx, d[inx]);
                    inx++;
                } ///
            });
        };
        Menu.prototype.onShow = function () {
            _super.prototype.onShow.call(this);
            main_10._.lm.load(this, 'menu', null, null, main_10._.screenCenterOffset);
            main_10._.sm.findOne("btnplay").click = function () {
                // vkpost("lalalal");
                main_10._.rules.withPlay = true;
                main_10._.sm.openStage(main_10._.rules);
            };
            main_10._.sm.findOne("btnrules").click = function () {
                main_10._.rules.withPlay = false;
                main_10._.sm.openStage(main_10._.rules);
            };
            main_10._.sm.findOne("btnscore").click = function () {
                main_10._.sm.openStage(main_10._.scores);
            };
            if (window.RESULT_MODAL_IN_MENU) {
                main_10._.game.score = 999;
                main_10._.game.ShowResModal();
            }
            // let g = _.cs("btnton1.png");
            // g.scale.x = 1.5;
            // g.scale.y = 1.5;
            // let btnTON = new Button(_.sm.findOne("btntonpos").pos, g);
            // btnTON.init({text:"N+1", fontscale: 0.7,});
            // (<Button>btnTON).click = () => {
            //     window.open((<any>window).LINK_TO_SOCIAL);
            // };
            //_.sm.gui2.addChild(btnTON.gfx);
            // /   this.getLeaderboard();
        };
        return Menu;
    }(Stage_1.Stage));
    exports.Menu = Menu;
});
define("Objects/ToolsBar", ["require", "exports", "Neu/BaseObjects/O", "main", "ProblemGenerator", "Objects/ButtonTool", "Neu/BaseObjects/TextBox", "Neu/Math"], function (require, exports, O_5, main_11, ProblemGenerator_1, ButtonTool_1, TextBox_4, Math_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ToolsBar = /** @class */ (function (_super) {
        __extends(ToolsBar, _super);
        function ToolsBar(pos, gfx) {
            var _this = _super.call(this, pos, gfx) || this;
            _this.tools = [];
            _this.gfx = main_11._.cc(main_11._.sm.gui);
            _this.addTool(ProblemGenerator_1.SOLUTIONS[0]);
            _this.addTool(ProblemGenerator_1.SOLUTIONS[1]);
            _this.addTool(ProblemGenerator_1.SOLUTIONS[2]);
            _this.addTool(ProblemGenerator_1.SOLUTIONS[3]);
            _this.addTool(ProblemGenerator_1.SOLUTIONS[4]);
            return _this;
        }
        ToolsBar.prototype.dragMove = function (btn, e) {
            btn.gfx.tint = 0xffffff;
            if (btn.gfx.dragging) {
                var newPosition = e.data.getLocalPosition(btn.gfx.parent);
                btn.gfx.position.x = newPosition.x;
                btn.gfx.position.y = newPosition.y;
            }
        };
        ToolsBar.prototype.dragEnd = function (btn, e) {
            var pos = e.data.getLocalPosition(btn.gfx.parent);
            var res = main_11._.game.pg.tryDropSolution(btn, [pos.x, pos.y]);
            for (var _i = 0, _a = this.tools; _i < _a.length; _i++) {
                var t = _a[_i];
                t.tint = 0xffffff;
            }
            if (!res) {
                btn.killNow();
            }
            btn.gfx.dragging = false;
        };
        ToolsBar.prototype.dragStart = function (btn, e) {
            btn.gfx.dragging = true;
            var inx = this.tools.indexOf(btn);
            var b = this.createToolBtn(btn.solution, inx);
            b.fadeOnMouseDown = false;
            this.tools[inx] = b;
            btn.gfx.parent.setChildIndex(btn.gfx, btn.gfx.parent.children.length - 1);
            b.tint = 0x888888;
        };
        ToolsBar.prototype.createToolBtn = function (sol, inx) {
            var button = new ButtonTool_1.ButtonTool([60 + inx * 130, main_11.SCR_HEIGHT - 151], main_11._.cs(sol.ico, main_11._.sm.gui));
            button.gfx.scale.set(0.7);
            button.init({});
            button.solution = sol;
            button.fadeOnMouseDown = false;
            button.gfx.x = button.x;
            button.gfx.y = button.y;
            button.gfx.
                on('mousedown', this.dragStart.bind(this, button)).
                on('mousemove', this.dragMove.bind(this, button)).
                on('mouseupoutside', this.dragEnd.bind(this, button)).
                on('mouseup', this.dragEnd.bind(this, button)).
                on('touchstart', this.dragStart.bind(this, button)).
                on('touchmove', this.dragMove.bind(this, button)).
                on('touchendoutside', this.dragEnd.bind(this, button)).
                on('touchend', this.dragEnd.bind(this, button));
            var x = new TextBox_4.TextBox(Math_4.m.v2cp(button.pos));
            x.y += 87;
            x.init({ fontscale: 0.4, align: "center" });
            x.text = sol.text;
            return button;
        };
        ToolsBar.prototype.addTool = function (sol) {
            var b = this.createToolBtn(sol, this.tools.length);
            this.tools.push(b);
        };
        return ToolsBar;
    }(O_5.O));
    exports.ToolsBar = ToolsBar;
});
define("Stages/Game", ["require", "exports", "Neu/Stage", "main", "Neu/BaseObjects/O", "Socials", "Stages/Menu", "ProblemGenerator", "Objects/ToolsBar", "Neu/Application", "Objects/AngryBar"], function (require, exports, Stage_2, main_12, O_6, Socials_1, Menu_1, ProblemGenerator_2, ToolsBar_1, Application_9, AngryBar_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LEVEL_TIME = 160.;
    exports.LevelsShapes = [
        [
            {
                ShapeID: 5,
                Quantity: 1,
            },
            {
                ShapeID: 6,
                Quantity: 1,
            }
        ],
        [
            {
                ShapeID: 10,
                Quantity: 1,
            },
            {
                ShapeID: 5,
                Quantity: 1,
            },
            {
                ShapeID: 9,
                Quantity: 1,
            }
        ],
        [
            {
                ShapeID: 10,
                Quantity: 2,
            },
            {
                ShapeID: 12,
                Quantity: 2,
            },
            {
                ShapeID: 9,
                Quantity: 2,
            },
            {
                ShapeID: 5,
                Quantity: 1,
            }
        ]
    ];
    var Game = /** @class */ (function (_super) {
        __extends(Game, _super);
        function Game() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.paused = false;
            _this._score = 0;
            _this.secs = 0;
            _this.level = 3;
            _this.limit = 0;
            return _this;
        }
        Game.prototype.pause = function (mode) {
            this.pauseTint = O_6.O.rp(this.pauseTint);
            if (mode) {
                this.pauseTint = new PIXI.Sprite(PIXI.Texture.WHITE);
                this.pauseTint.width = main_12.SCR_WIDTH;
                this.pauseTint.height = main_12.SCR_HEIGHT;
                this.pauseTint.alpha = 0.5;
                main_12._.sm.findOne("btnpause").gfx.alpha = 0;
                main_12._.sm.findOne("btnstart").gfx.alpha = 1;
                main_12._.sm.gui.addChild(this.pauseTint);
                this.pauseTint.tint = 0x333344;
                Application_9.TweenMax.pauseAll(true, true, true);
            }
            else {
                main_12._.sm.findOne("btnpause").gfx.alpha = 1;
                main_12._.sm.findOne("btnstart").gfx.alpha = 0;
                Application_9.TweenMax.resumeAll(true, true, true);
            }
            this.paused = mode;
            this.pg.pause(mode);
        };
        Object.defineProperty(Game.prototype, "progress", {
            get: function () {
                return this._progress;
            },
            set: function (value) {
                this._progress = value;
                var pb = main_12._.sm.findOne("progressbar");
                pb.gfx.width = this.initProgressW * value;
                if (value < 0.00001)
                    pb.gfx.scale.x = 0.00001;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Game.prototype, "score", {
            get: function () {
                return this._score;
            },
            set: function (value) {
                this._score = value;
                var tb = main_12._.sm.findOne("score");
                var scoreStr = value.toString();
                var len = scoreStr.length;
                var str = ('0000' + scoreStr).slice(-4);
                tb.text = str;
            },
            enumerable: true,
            configurable: true
        });
        Game.prototype.submitScore = function (s, social_id, name, last_name) {
            if (s == 0)
                return;
            main_12.$.post(Menu_1.API_PHP_FILE, { func: "submit", score: s.toString(), social_id: social_id, name: name, last_name: last_name })
                .done(function (data) {
            });
        };
        Game.prototype.onShow = function () {
            var _this = this;
            this.resModal = null;
            _super.prototype.onShow.call(this);
            this.toolsBar = new ToolsBar_1.ToolsBar([0, 0], null);
            this._progress = 0;
            if (window.RESULT_MODAL_IN_MENU) {
                main_12._.game.score = 999;
                main_12._.game.ShowResModal();
            }
            this.progressAnim = Application_9.TweenMax.to(this, exports.LEVEL_TIME, { progress: 1, ease: Application_9.Linear.easeNone,
                onComplete: function () {
                    _this.ShowResModal();
                } });
            this.pg = new ProblemGenerator_2.ProblemGenerator();
            main_12._.lm.load(this, 'gameui', null);
            document.addEventListener('visibilitychange', function () {
                if (document.hidden) {
                    _this.pause(true);
                }
                else {
                    if (_this.resModal) {
                        return;
                    }
                    _this.pause(false);
                }
            });
            main_12._.sm.findOne("btnstart").gfx.alpha = 0;
            main_12._.sm.findOne("btnpause").click = function () {
                _this.pause(!_this.paused);
            };
            main_12._.sm.findOne("btnmenu").click = function () {
                main_12._.sm.openStage(main_12._.menu);
            };
            main_12._.sm.findOne("btnstart").click = function () {
                _this.pause(!_this.paused);
            };
            this.pg.run();
            this.score = 0;
            var pb = main_12._.sm.findOne("progressbar");
            this.initProgressW = pb.gfx.width;
            pb.gfx.anchor.x = 0;
            pb.x -= pb.width / 2;
            this.pause(false);
            main_12._.sm.findByType(AngryBar_1.AngryBar)[0].value = 1;
        };
        Game.prototype.CloseResModal = function () {
            main_12._.sm.removeList(this.resModal);
        };
        Game.prototype.onHide = function (s) {
            main_12._.sm.removeList(this.resModal);
            this.whiteSpace = O_6.O.rp(this.whiteSpace);
            this.timeInterval = main_12._.killTweens(this.timeInterval);
            this.progressAnim = main_12._.killTweens(this.progressAnim);
            _super.prototype.onHide.call(this, s);
            this.toolsBar.killNow();
        };
        Game.prototype.ShowResModal = function () {
            var _this = this;
            if (this.resModal) {
                return;
            }
            this.secs = Math.round(this.progress * exports.LEVEL_TIME);
            this.pg.pause(true);
            Application_9.TweenMax.pauseAll(true, true, true);
            this.resModal = main_12._.lm.load(main_12._.game, 'winmodal', null, null, main_12._.screenCenterOffset);
            var win = main_12._.sm.findOne("scorewin", this.resModal);
            win.text = "Вы набрали " + this.score + " очков";
            var vk = main_12._.sm.findOne("btnvk", this.resModal);
            var fb = main_12._.sm.findOne("btnfb", this.resModal);
            var retry = main_12._.sm.findOne("btnretry", this.resModal);
            retry.click = function () {
                main_12._.sm.openStage(_this);
            };
            vk.click = function () {
                Socials_1.vkpost("\u041C\u0435\u043D\u044F \u0445\u0432\u0430\u0442\u0438\u043B\u043E \u043D\u0430 " + _this.secs.toString() + " секунд в игре „Электрички“");
            };
            fb.click = function () {
                Socials_1.fbpost();
            };
            /*        let g = _.cs("btnton1.png");
                    g.scale.x = 1.5;
                    g.scale.y = 1.5;
                    let btnTON = new Button(_.sm.findOne("btntonpos").pos, g);
                    btnTON.init({text:"N+1", fontscale: 0.7,});
                    (<Button>btnTON).click = () => {
                        window.open((<any>window).LINK_TO_SOCIAL);
                    };
            
                    _.sm.gui2.addChild(btnTON.gfx);*/
        };
        Game.prototype.SetScore = function (x) {
            this._score = x;
            if (x == 0)
                main_12._.sm.findOne("_score").text = '';
            else
                main_12._.sm.findOne("_score").text = this.AddZeroes(x);
        };
        Game.prototype.AddZeroes = function (x) {
            if (x < 10)
                return '0000' + x.toString();
            else if (x < 100)
                return '000' + x.toString();
            else if (x < 1000)
                return '00' + x.toString();
            return x.toString();
        };
        Game.prototype.updateTime = function () {
            var mins = Math.floor(this.secs / 60);
            var secs = this.secs % 60;
            var time = main_12._.sm.findOne("time");
            time.text = mins + ":" + (secs > 10 ? secs.toString() : "0" + secs.toString());
        };
        return Game;
    }(Stage_2.Stage));
    exports.Game = Game;
});
define("ProblemGenerator", ["require", "exports", "Neu/BaseObjects/O", "main", "Objects/Problem", "Neu/Math", "Neu/Application", "Stages/Game", "Objects/AngryBar"], function (require, exports, O_7, main_13, Problem_1, Math_5, Application_10, Game_1, AngryBar_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var COMPILCATED_COLOR = [0xff / 255, 0x60 / 255, 0x1a / 255];
    exports.SOLUTIONS = [{
            type: 1,
            text: "\u0412\u044B\u0437\u0432\u0430\u0442\u044C\n\u0440\u0435\u043C\u043E\u043D\u0442\u043D\u0438-\n\u043A\u043E\u0432",
            ico: "icon_1",
        },
        {
            type: 2,
            text: "\u0412\u044B\u0437\u043E\u0432\n\u043F\u043E\u043B\u0438\u0446\u0438\u0438",
            ico: "icon_2",
        },
        {
            type: 3,
            text: "\u0412\u044B\u0437\u043E\u0432\n\u043C\u0435\u0434\u0438\u043A\u043E\u0432",
            ico: "icon_3",
        },
        {
            type: 4,
            text: "\u0418\u043D\u0444\u043E\u0440\u043C\u0438-\n\u0440\u043E\u0432\u0430\u0442\u044C\n\u043F\u0430\u0441\u0441\u0430\u0436\u0438\u0440\u043E\u0432",
            ico: "icon_4",
        },
        {
            type: 5,
            text: "\u0410\u043B\u044C\u0442\u0435\u0440\u043D\u0430-\n\u0442\u0438\u0432\u043D\u043E\u0435 \n\u0434\u0432\u0438\u0436\u0435\u043D\u0438\u0435",
            ico: "icon_5",
        }];
    var PROBLEMS = [
        {
            penalty: 0.1,
            type: 0,
            text: "",
            startAt: 60,
            solutions: [1, 2, 3, 4, 5],
            complicated: false,
            score: 500,
        },
        {
            penalty: 0.1,
            type: 1,
            text: "\u041F\u043E\u0442\u0435\u0440\u044F\n\u043F\u0438\u0442\u0430\u043D\u0438\u044F",
            startAt: 10,
            solutions: [1],
            complicated: false,
            score: 100,
        },
        {
            penalty: 0.1,
            type: 2,
            text: "\u041F\u043E\u0442\u0435\u0440\u044F\n\u043F\u0438\u0442\u0430\u043D\u0438\u044F",
            startAt: 0,
            solutions: [1, 4],
            complicated: true,
            score: 200,
        },
        {
            penalty: 0.1,
            type: 3,
            startAt: 30,
            text: "\u0421\u0442\u043E\u043F-\u043A\u0440\u0430\u043D",
            solutions: [4],
            complicated: false,
            score: 30,
        },
        {
            penalty: 0.1,
            type: 4,
            text: "\u041F\u043B\u043E\u0445\u043E\n\u043F\u0430\u0441\u0441\u0430\u0436\u0438\u0440\u0443",
            startAt: 0,
            solutions: [3],
            complicated: false,
            score: 100,
        },
        {
            penalty: 0.1,
            type: 5,
            text: "\u041F\u043B\u043E\u0445\u043E\n\u043F\u0430\u0441\u0441\u0430\u0436\u0438\u0440\u0443",
            startAt: 5,
            solutions: [3, 4],
            complicated: true,
            score: 50,
        },
        {
            penalty: 0.1,
            type: 6,
            text: "\u0421\u0431\u0438\u043B\u0438\n\u043B\u043E\u0441\u044F",
            startAt: 10,
            solutions: [1, 4],
            complicated: false,
            score: 50,
        },
        {
            penalty: 0.2,
            type: 7,
            text: "\u0421\u0431\u0438\u043B\u0438\n\u043B\u043E\u0441\u044F",
            startAt: 30,
            solutions: [1, 4, 5],
            complicated: true,
            score: 200,
        },
        {
            penalty: 0.1,
            type: 8,
            text: "\u0423\u043A\u0440\u0430\u043B\u0438\n\u0441\u0443\u043C\u043A\u0443",
            startAt: 0,
            solutions: [2],
            complicated: false,
            score: 100,
        },
        {
            penalty: 0.1,
            type: 9,
            text: "\u0423\u043A\u0440\u0430\u043B\u0438\n\u0441\u0443\u043C\u043A\u0443",
            startAt: 30,
            solutions: [2, 4],
            complicated: true,
            score: 200,
        },
        {
            penalty: 0.1,
            type: 10,
            text: "\u0412\u0430\u043D\u0434\u0430\u043B\u0438\u0437\u043C",
            startAt: 15,
            solutions: [1],
            complicated: false,
            score: 50,
        },
        {
            penalty: 0.15,
            type: 11,
            text: "\u0412\u0430\u043D\u0434\u0430\u043B\u0438\u0437\u043C",
            startAt: 60,
            solutions: [1, 4, 2],
            complicated: true,
            score: 200,
        },
        {
            penalty: 0.1,
            type: 12,
            text: "\u0414\u0435\u0440\u0435\u0432\u043E\n\u043D\u0430 \u043F\u0443\u0442\u044F\u0445",
            startAt: 0,
            solutions: [1],
            complicated: false,
            score: 50,
        },
        {
            penalty: 0.15,
            type: 13,
            text: "\u0414\u0435\u0440\u0435\u0432\u043E\n\u043D\u0430 \u043F\u0443\u0442\u044F\u0445",
            startAt: 30,
            solutions: [1, 4],
            complicated: true,
            score: 200,
        },
        {
            penalty: 0.1,
            type: 14,
            text: "\u0412\u0430\u043D\u0434\u0430\u043B\u0438\u0437\u043C",
            startAt: 0,
            solutions: [1],
            complicated: false,
            score: 100,
        },
    ];
    var ProblemGenerator = /** @class */ (function (_super) {
        __extends(ProblemGenerator, _super);
        function ProblemGenerator() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.problems = [];
            _this.lines = [null, null, null, null, null];
            _this.paused = false;
            return _this;
        }
        ProblemGenerator.prototype.wrongAnimation = function (g) {
        };
        ProblemGenerator.prototype.clear = function () {
            main_13._.sm.removeList(this.problems);
            main_13._.killTweens(this.anim);
            this.problems = [];
        };
        ProblemGenerator.prototype.stop = function () {
            this.clear();
            main_13._.killTweens(this.anim, this.diffTween);
            this.difficulty = 1;
            this.running = false;
        };
        ProblemGenerator.prototype.process = function () {
            if (this.paused)
                return;
            _super.prototype.process.call(this);
            var speed = this.difficulty * 0.7;
            if (this.running) {
                for (var _i = 0, _a = this.problems; _i < _a.length; _i++) {
                    var p = _a[_i];
                    var th = main_13.SCR_WIDTH - 140;
                    var spdres = speed;
                    if (p.x > th && p.x < main_13.SCR_WIDTH) {
                        spdres = 5 * (p.x - th) / 140 + speed;
                    }
                    if (!p.solved && p.x < main_13.SCR_WIDTH)
                        p.gfxBrick.width += spdres;
                    p.x -= spdres;
                    var red = (main_13.SCR_WIDTH / 1.5 - p.x) / main_13.SCR_WIDTH;
                    if (red < 0)
                        red = 0;
                    if (p.solved)
                        for (var _b = 0, _c = p.toolsSolved; _b < _c.length; _b++) {
                            var s = _c[_b];
                            s.gfx.x -= spdres;
                        }
                    else {
                        if (!p.bigProblem) {
                            if (p.problemType.complicated) {
                                p.gfxBrick.color.lightR = (COMPILCATED_COLOR[0]);
                                p.gfxBrick.color.lightB = (COMPILCATED_COLOR[2] - red / 1.5);
                                p.gfxBrick.color.lightG = (COMPILCATED_COLOR[1] - red / 1.5);
                                if (p.gfxBrick.color.lightB < 0)
                                    p.gfxBrick.color.lightB = 0;
                                if (p.gfxBrick.color.lightG < 0)
                                    p.gfxBrick.color.lightG = 0;
                            }
                            else {
                                p.gfxBrick.color.lightB = (1 - red / 1.5);
                                p.gfxBrick.color.lightG = (1 - red / 1.5);
                            }
                        }
                    }
                    if (!p.solved && p.x < 0) {
                        main_13._.sm.findByType(AngryBar_2.AngryBar)[0].value -= 1.2 * p.problemType.penalty;
                        this.solveProblem(p, true);
                    }
                }
            }
        };
        ProblemGenerator.prototype.timeout = function (start) {
            var _this = this;
            if (start === void 0) { start = false; }
            this.anim = this.setTimeout(function () {
                var inx = 0;
                var free = [];
                var line = 0;
                for (var _i = 0, _a = _this.lines; _i < _a.length; _i++) {
                    var x = _a[_i];
                    var isBusy = false;
                    for (var _b = 0, _c = _this.problems; _b < _c.length; _b++) {
                        var c = _c[_b];
                        if (c.line == line) {
                            if (c.gfx.x + c.gfxBrick.width > main_13.SCR_WIDTH - 100) {
                                isBusy = true;
                                break;
                            }
                        }
                    }
                    if (!x && !isBusy) {
                        free.push(inx);
                    }
                    inx++;
                }
                if (free.length != 0) {
                    var freeLine = Math_5.m.getRand(free);
                    _this.spawnProblemOnLine(freeLine);
                }
                _this.timeout();
            }, start ? 0 :
                1.7 + (0.8 + 0.2 * Math.random()) * (3.6 - Math.pow(this.difficulty, 1.28)));
        };
        ProblemGenerator.prototype.run = function () {
            this.running = true;
            this.difficulty = 1.45;
            this.diffTween = Application_10.TweenMax.to(this, Game_1.LEVEL_TIME, { difficulty: 2.7, ease: Application_10.Linear.easeNone });
            this.timeout(true);
            /*this.spawnProblemOnLine(1);
            this.spawnProblemOnLine(2);
            this.spawnProblemOnLine(3);
            this.spawnProblemOnLine(4);*/
        };
        ProblemGenerator.prototype.spawnProblemOnLine = function (lineNum) {
            var _this = this;
            var availProblems = PROBLEMS.filter(function (p) {
                var res = (((p.startAt / 100.) <= _this.progress()) ||
                    ((p.startAt / 200.) <= _this.progress() && Math.random() < 0.5));
                if (_this.progress() > 0.5 && (p.startAt / 100.) < 0.4)
                    return Math.random() < 0.25;
                return res;
            });
            var prob = Math_5.m.getRand(availProblems);
            var problem = new Problem_1.Problem([main_13._.SCR_WIDTH + 60, main_13.SCR_HEIGHT - lineNum * 100 - 335], null, prob);
            main_13._.sm.main.addChild(problem.gfx);
            this.problems.push(problem);
            problem.line = lineNum;
            this.lines[lineNum] = problem;
        };
        ProblemGenerator.prototype.solveProblem = function (problem, failed) {
            if (failed === void 0) { failed = false; }
            problem.solved = true;
            if (!failed)
                problem.solveAnimation();
            else
                problem.failanim();
            problem.gfxBrick.width = main_13.SCR_WIDTH - problem.gfx.x + 3;
            var inx = 0;
            for (var _i = 0, _a = this.lines; _i < _a.length; _i++) {
                var l = _a[_i];
                if (l == problem) {
                    this.lines[inx] = null;
                }
                inx++;
            }
        };
        ProblemGenerator.prototype.tryDropSolution = function (btn, pos) {
            var res = -1;
            var inx = 0;
            for (var _i = 0, _a = this.lines; _i < _a.length; _i++) {
                var x = _a[_i];
                if (x) {
                    var rect = x.gfx.getBounds(true);
                    rect.pad(20, 20);
                    if (rect.contains(pos[0] * main_13._.appScale, pos[1] * main_13._.appScale)) {
                        res = inx;
                        break;
                    }
                }
                inx++;
            }
            if (res >= 0) {
                var cur = this.lines[res];
                var r = cur.dropSolution(btn);
                var completelySolved = true;
                for (var _b = 0, _c = cur.problemType.solutions; _b < _c.length; _b++) {
                    var s = _c[_b];
                    if (~cur.solutions.indexOf(s)) {
                    }
                    else {
                        completelySolved = false;
                    }
                }
                if (completelySolved) {
                    this.solveProblem(cur);
                    main_13._.game.score += cur.problemType.score;
                }
                return r;
            }
            return false;
        };
        ProblemGenerator.prototype.progress = function () {
            return main_13._.game.progressAnim.progress();
        };
        ProblemGenerator.prototype.pause = function (b) {
            this.paused = b;
        };
        return ProblemGenerator;
    }(O_7.O));
    exports.ProblemGenerator = ProblemGenerator;
});
define("Objects/ButtonTool", ["require", "exports", "Neu/BaseObjects/Button"], function (require, exports, Button_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ButtonTool = /** @class */ (function (_super) {
        __extends(ButtonTool, _super);
        function ButtonTool() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.tint = 0xffffff;
            return _this;
        }
        ButtonTool.prototype.process = function () {
            this.gfx.tint = this.tint;
        };
        return ButtonTool;
    }(Button_1.Button));
    exports.ButtonTool = ButtonTool;
});
define("Objects/ScrollBox", ["require", "exports", "Neu/BaseObjects/O", "main"], function (require, exports, O_8, main_14) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ScrollBox = /** @class */ (function (_super) {
        __extends(ScrollBox, _super);
        function ScrollBox(pos, gfx) {
            var _this = _super.call(this, pos, gfx) || this;
            _this.scrolling = false;
            _this._maskWidth = 100;
            _this._maskHeight = 100;
            _this.maxScroll = 1250;
            _this.gfx = main_14._.cc();
            _this.container = main_14._.cc();
            return _this;
        }
        Object.defineProperty(ScrollBox.prototype, "maskHeight", {
            get: function () {
                return this._maskHeight;
            },
            set: function (value) {
                this._maskHeight = value;
                this.updateMask();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollBox.prototype, "maskWidth", {
            get: function () {
                return this._maskWidth;
            },
            set: function (value) {
                this._maskWidth = value;
                this.updateMask();
            },
            enumerable: true,
            configurable: true
        });
        //asdasd
        ScrollBox.prototype.process = function () {
            _super.prototype.process.call(this);
            if (this.scrolling) {
                this.scrollDown(-10);
            }
        };
        ScrollBox.prototype.init = function (p) {
            _super.prototype.init.call(this, p);
            if (this.layer) {
                this.layer.addChild(this.gfx);
            }
            this.x -= this.width / 2;
            this.y -= this.height / 2;
            this.mask = new PIXI.Graphics();
            this.masked = main_14._.cc();
            this.container.mask = this.mask;
            this.container.addChild(this.mask);
            this.container.addChild(this.masked);
            this.gfx.addChild(this.container);
            this.maskWidth = this.width;
            this.maskHeight = this.height;
            this.gfx.buttonMode = true;
            this.gfx.interactive = true;
            /*  this.gfx.on('mousedown', this.scrollstart.bind(this)).
              on('touchstart', this.touchstart.bind(this)).
              on('mouseup', this.scrollend.bind(this)).
              on('mouseupoutside', this.scrollend.bind(this)).
              on('touchendoutside', this.scrollend.bind(this)).
              on('touchmove', this.touchmove.bind(this)).
              on('touchend', this.touchend.bind(this));
      */
            //      this.bindedWheel = this.onWheel.bind(this);
            //   document.addEventListener("mousewheel", this.bindedWheel, false);
        };
        ScrollBox.prototype.onDestroy = function () {
            _super.prototype.onDestroy.call(this);
            // document.removeEventListener("mousewheel", this.bindedWheel, false);
        };
        ScrollBox.prototype.onWheel = function (e) {
            this.scrollDown(e.wheelDeltaY / 2);
        };
        ScrollBox.prototype.touchstart = function (e) {
            this.starty = e.data.originalEvent.touches[0].clientY;
            this.prev = null;
            //this.scrolling = false;
        };
        ScrollBox.prototype.touchend = function () {
            //this.scrolling = false;
        };
        ScrollBox.prototype.touchmove = function (e) {
            var delta = (this.prev ? this.prev : this.starty) - e.data.originalEvent.changedTouches[0].clientY;
            this.scrollDown(-delta);
            this.prev = e.data.originalEvent.changedTouches[0].clientY;
        };
        ScrollBox.prototype.scrollend = function () {
            this.scrolling = false;
        };
        ScrollBox.prototype.scrollstart = function () {
            this.scrolling = true;
        };
        ScrollBox.prototype.scrollDown = function (delta) {
            this.masked.y += delta;
            if (this.masked.y > 0) {
                this.masked.y = 0;
            }
            if (this.masked.y < -this.maxScroll) {
                this.masked.y = -this.maxScroll;
            }
        };
        ScrollBox.prototype.updateMask = function () {
            this.mask.clear();
            this.mask.beginFill(0xff0000, 1);
            this.mask.drawRect(0, 0, this._maskWidth, this._maskHeight);
            this.mask.endFill();
        };
        return ScrollBox;
    }(O_8.O));
    exports.ScrollBox = ScrollBox;
});
define("Neu/BaseObjects/Aligner", ["require", "exports", "Neu/BaseObjects/O", "Neu/Application"], function (require, exports, O_9, Application_11) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Created by KURWINDALLAS on 17.11.2014.
     */
    var Aligner = /** @class */ (function (_super) {
        __extends(Aligner, _super);
        function Aligner() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.crossed = [0, 0];
            return _this;
        }
        Aligner.prototype.init = function (props) {
            _super.prototype.init.call(this, props);
            if (this.x - this.width / 2 < Application_11.Application.One.screenCenterOffset[0]) {
                this.crossed[0] = -1;
            }
            if (this.x + this.width / 2 > Application_11.Application.One.screenCenterOffset[0] + Application_11.Application.One.MIN_SCR_WIDTH) {
                this.crossed[0] = 1;
            }
            if (this.y - this.height / 2 < Application_11.Application.One.screenCenterOffset[1]) {
                this.crossed[1] = -1;
            }
            if (this.y + this.height / 2 > Application_11.Application.One.screenCenterOffset[1] + Application_11.Application.One.MIN_SCR_HEIGHT) {
                this.crossed[1] = 1;
            }
            var objectsUnderAligner = Aligner.collectObjectsUnder(this);
            var deltaX = Application_11.Application.One.screenCenterOffset[0] * this.crossed[0];
            var deltaY = Application_11.Application.One.screenCenterOffset[1] * this.crossed[1];
            for (var _i = 0, objectsUnderAligner_1 = objectsUnderAligner; _i < objectsUnderAligner_1.length; _i++) {
                var x = objectsUnderAligner_1[_i];
                x.x += deltaX;
                x.y += deltaY;
                x.process();
            }
            this.killNow();
        };
        Aligner.prototype.process = function () {
        };
        Aligner.collectObjectsUnder = function (o, fixlayers) {
            if (fixlayers === void 0) { fixlayers = [Application_11.Application.One.sm.gui, Application_11.Application.One.sm.gui2]; }
            var res = [];
            for (var _i = 0, _a = Application_11.Application.One.lm.objectsList; _i < _a.length; _i++) {
                var x = _a[_i];
                if (x != o && x.parent == null && (fixlayers.indexOf(x.layer) >= 0) && x.intersects(o)) {
                    res.push(x);
                }
            }
            return res;
        };
        return Aligner;
    }(O_9.O));
    exports.Aligner = Aligner;
});
define("Neu/shaders/LightFilter", ["require", "exports", "main"], function (require, exports, main_15) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LightFilter = /** @class */ (function (_super) {
        __extends(LightFilter, _super);
        function LightFilter(options) {
            var _this = _super.call(this, main_15._.rm.shaders["default.vert"], main_15._.rm.shaders["lightfilter.frag"], {
                lightSampler: { type: 'sampler2D', value: options.lightSampler },
                gamma: { type: 'float', value: 1 },
                saturation: { type: 'float', value: 0.1 },
                contrast: { type: 'float', value: 1 },
                brightness: { type: 'float', value: 1 },
                red: { type: 'float', value: 1 },
                green: { type: 'float', value: 1 },
                blue: { type: 'float', value: 1 },
                alpha: { type: 'float', value: 1 },
            }) || this;
            if (options.gamma)
                _this.uniforms.gamma = options.gamma;
            _this.uniforms.gamma = Math.max(_this.uniforms.gamma, 0.0001);
            if (options.saturation)
                _this.uniforms.saturation = options.saturation;
            if (options.contrast)
                _this.uniforms.contrast = options.contrast;
            if (options.brightness)
                _this.uniforms.brightness = options.brightness;
            if (options.red)
                _this.uniforms.red = options.red;
            if (options.green)
                _this.uniforms.green = options.green;
            if (options.blue)
                _this.uniforms.blue = options.blue;
            if (options.alpha)
                _this.uniforms.alpha = options.alpha;
            return _this;
        }
        /**
         * Override existing apply method in PIXI.Filter
         * @private
         */
        LightFilter.prototype.apply = function (filterManager, input, output, clear) {
            filterManager.applyFilter(this, input, output, clear);
        };
        return LightFilter;
    }(PIXI.Filter));
    exports.LightFilter = LightFilter;
});
define("Neu/BaseObjects/Lighting", ["require", "exports", "Neu/BaseObjects/BaseLighting", "Neu/Application", "Neu/BaseObjects/Light", "Neu/shaders/LightFilter", "Neu/BaseObjects/O", "Neu/Math", "main", "Neu/Loader"], function (require, exports, BaseLighting_1, Application_12, Light_1, LightFilter_1, O_10, Math_6, main_16, Loader_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Lighting = /** @class */ (function (_super) {
        __extends(Lighting, _super);
        function Lighting() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.lights = [];
            _this.baseLight = [1, 1, 1];
            _this.baseIllum = [1, 1, 1];
            _this._darkness = 1;
            _this.color = [.5, .5, .5];
            _this.illum = [1, 1, 1];
            return _this;
        }
        Object.defineProperty(Lighting.prototype, "darkness", {
            get: function () {
                return this._darkness;
            },
            set: function (value) {
                this._darkness = value;
                if (this.lights)
                    for (var _i = 0, _a = this.lights; _i < _a.length; _i++) {
                        var l = _a[_i];
                        l.gfx.alpha = l.baseAlpha * this._darkness;
                    }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Lighting.prototype, "brightness", {
            get: function () {
                return this._brightness;
            },
            set: function (value) {
                this._brightness = value;
                this.lightFilter.uniforms.brightness = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Lighting.prototype, "gamma", {
            get: function () {
                return this._gamma;
            },
            set: function (value) {
                this._gamma = value;
                this.lightFilter.uniforms.gamma = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Lighting.prototype, "contrast", {
            get: function () {
                return this._contrast;
            },
            set: function (value) {
                this._contrast = value;
                this.lightFilter.uniforms.contrast = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Lighting.prototype, "saturation", {
            get: function () {
                return this._saturation;
            },
            set: function (value) {
                this._saturation = value;
                this.lightFilter.uniforms.saturation = value;
            },
            enumerable: true,
            configurable: true
        });
        Lighting.prototype.onDestroy = function () {
            if (this.gfx) {
                this.gfx.filters[0].blendMode = PIXI.BLEND_MODES.NORMAL;
                this.gfx.filters = null;
                this.gfx.filterArea = null;
                Application_12.TweenMax.killTweensOf(this);
            }
            O_10.O.rp(this.ambientContainer);
            O_10.O.rp(this.ambient);
            this.ambientContainer = null;
            this.ambient = null;
            this.lights = [];
            _super.prototype.onDestroy.call(this);
        };
        Lighting.prototype.init = function (props) {
            this.alwaysVisible = true;
            this.ambient = Application_12.Application.One.cs(BaseLighting_1.BaseLighting.DEFAULT_GFX);
            this.ambient.width = Application_12.Application.One.SCR_WIDTH;
            this.ambient.height = Application_12.Application.One.SCR_HEIGHT;
            this.baseScaleX = this.ambient.scale.x;
            this.baseScaleY = this.ambient.scale.y;
            this.lightingLayer = new PIXI.display.Layer();
            this.lightingLayer.useRenderTexture = true;
            this.layer.addChild(this.lightingLayer);
            this.lightFilter = new LightFilter_1.LightFilter({ saturation: 0, brightness: 0., contrast: 0., gamma: 1, lightSampler: this.lightingLayer.getRenderTexture() });
            if (props["saturation"]) {
                this.saturation = parseFloat(props["saturation"]);
            }
            this.contrast = 0.5;
            if (props["contrast"]) {
                this.contrast = parseFloat(props["contrast"]);
            }
            this.gamma = 1;
            if (props["gamma"]) {
                this.gamma = parseFloat(props["gamma"]);
            }
            this.brightness = 1;
            if (props["brightness"]) {
                this.brightness = parseFloat(props["brightness"]);
            }
            this.lightFilter.resolution = main_16._.app.renderer.resolution; // 1 / window.devicePixelRatio;//Application.One.resolution;
            Application_12.Application.One.sm.main.filterArea = Application_12.Application.One.app.screen;
            Application_12.Application.One.sm.main.filters = [this.lightFilter];
            this.ambient.parentLayer = this.lightingLayer;
            this.layer.addChild(this.ambient);
            this.blendMode = PIXI.BLEND_MODES.ADD;
            if (props && !props["blendmode"])
                this.blendMode = PIXI.BLEND_MODES.ADD;
            else
                this.blendMode = Loader_1.extractBlendMode(props["blendmode"]);
            if (props['_darkness']) {
                this._darkness = parseFloat(props['_darkness']);
            }
            if (props['color']) {
                this.color = Math_6.m.ARGBtoRGB(Math_6.m.hexToRgb(props['color']));
            }
            if (props['illum']) {
                this.illum = Math_6.m.ARGBtoRGB(Math_6.m.hexToRgb(props['illum']));
            }
            this.wait(0).call(this.updateLights.bind(this)).apply();
            this.redraw();
            this.set(this.color, this.illum);
            this.process();
        };
        Lighting.prototype.updateLights = function () {
            if (this.lights) {
                for (var _i = 0, _a = this.lights; _i < _a.length; _i++) { //SKIP AMBIENT + LAYER CONTAINER
                    var x = _a[_i];
                    if (x.gfx) {
                        x.gfx.parentLayer = null;
                        O_10.O.rp(x.gfx);
                    }
                }
            }
            this.lights = Application_12.Application.One.sm.findByType(Light_1.Light);
            for (var _b = 0, _c = this.lights; _b < _c.length; _b++) {
                var x = _c[_b];
                this.addLight(x);
            }
        };
        Lighting.prototype.tweenColorTo = function (col, illum, deltaTimeSec) {
            if (illum === void 0) { illum = null; }
            if (deltaTimeSec === void 0) { deltaTimeSec = 1.9; }
            var tweens = [
                Application_12.TweenMax.to(this.lightFilter.uniforms, deltaTimeSec, { red: col[0],
                    green: col[1],
                    blue: col[2],
                    ease: Application_12.Sine.easeIn,
                })
            ];
            if (illum)
                tweens.push(Application_12.TweenMax.to(this.ambient.color, deltaTimeSec, {
                    lightR: illum[0] * this.baseIllum[0],
                    lightG: illum[1] * this.baseIllum[1],
                    lightB: illum[2] * this.baseIllum[2],
                    ease: Application_12.Sine.easeIn,
                }));
            return tweens;
        };
        Lighting.prototype.redraw = function () {
        };
        Lighting.prototype.addLight = function (l) {
            l.gfx.parentLayer = null;
            O_10.O.rp(l.gfx);
            l.gfx.stringID = l.stringID;
            l.gfx.blendMode = this.blendMode;
            l.gfx.alpha = l.baseAlpha * this._darkness;
            l.gfx.parentLayer = this.lightingLayer;
            this.layer.addChild(l.gfx);
        };
        Lighting.prototype.process = function () {
            this.ambient.x = -Application_12.Application.One.SCR_WIDTH * (-0.5);
            this.ambient.y = -Application_12.Application.One.SCR_HEIGHT * (-0.5);
            this.ambient.scale.x = (this.baseScaleX / Application_12.Application.One.sm.camera.zoom); // -_.sm.camera.x - _.SCR_WIDTH_HALF;
            this.ambient.scale.y = (this.baseScaleY / Application_12.Application.One.sm.camera.zoom); // -_.sm.camera.y - _.SCR_HEIGHT_HALF;
            //    let arr  = [Math.round(this.lightFilter.uniforms.red*255), Math.round(this.lightFilter.uniforms.green*255), Math.round(this.lightFilter.uniforms.blue*255),
            //        Math.round(this.ambient.color.lightR*255), Math.round(this.ambient.color.lightG*255), Math.round(this.ambient.color.lightB*255),
            //
            //          Math.round(100*this.lightFilter.uniforms.saturation)/ 100,
            //        Math.round(100*this.lightFilter.uniforms.contrast)/ 100,
            //      Math.round(100*this.lightFilter.uniforms.brightness)/ 100];
            //console.log(arr);
            this.redraw();
        };
        Lighting.prototype.set = function (col, illum) {
            if (illum === void 0) { illum = null; }
            this.illum = illum;
            this.color = col;
            this.lightFilter.uniforms.red = col[0];
            this.lightFilter.uniforms.green = col[1];
            this.lightFilter.uniforms.blue = col[2];
            if (illum)
                this.ambient.color.setLight(illum[0], illum[1], illum[2]);
        };
        return Lighting;
    }(O_10.O));
    exports.Lighting = Lighting;
});
define("Neu/BaseObjects/Light", ["require", "exports", "Neu/BaseObjects/O", "Neu/Application", "Neu/BaseObjects/Lighting"], function (require, exports, O_11, Application_13, Lighting_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Light = /** @class */ (function (_super) {
        __extends(Light, _super);
        function Light() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.rndSeed = 0;
            _this.isCandle = false;
            _this.baseAlpha = 1;
            return _this;
        }
        Light.prototype.onDestroy = function () {
            if (this.gfx.parentLayer)
                this.gfx.parentLayer.removeChild(this.gfx);
            this.gfx.parentLayer = null;
            O_11.O.rp(this.gfx);
            _super.prototype.onDestroy.call(this);
        };
        Light.prototype.createPolygon = function (polygon, properties) {
            var g = new PIXI.Graphics();
            var points = polygon;
            var pointsArr = points.split(' ');
            g.clear();
            g.beginFill(properties.color ? parseInt(properties.color.replace('#', '0x')) : 0xffffff, properties.alpha ? properties.alpha : 1);
            var arr = [];
            var minx = Infinity;
            var miny = Infinity;
            for (var _i = 0, pointsArr_1 = pointsArr; _i < pointsArr_1.length; _i++) {
                var x = pointsArr_1[_i];
                var p = x.split(',');
                var xx = parseFloat(p[0]);
                var yy = parseFloat(p[1]);
                minx = minx > xx ? xx : minx;
                miny = miny > yy ? yy : miny;
                arr.push(xx, yy);
            }
            g.drawPolygon(arr);
            var b = g.getBounds();
            var dx = g.width * 0.4;
            var dy = g.height * 0.4;
            g.x = -minx + dx / 2;
            g.y = -miny + dy / 2;
            g.endFill();
            var bf = new PIXI.filters.BlurFilter(1, 3);
            bf.blurX = properties.blurx ? parseFloat(properties.blurx) : 1;
            bf.blurY = properties.blury ? parseFloat(properties.blury) : 1;
            g.filters = [bf];
            var renderTexture = PIXI.RenderTexture.create(b.width + dx, b.height + dy);
            Application_13.Application.One.app.renderer.render(g, renderTexture);
            var container = new PIXI.Container();
            var spr = new PIXI.heaven.Sprite(renderTexture);
            // spr.anchor.x = 0.5;
            // spr.anchor.y = 0.5;
            spr.x = minx - dx / 2;
            spr.y = miny - dy / 2;
            container.addChild(spr);
            return container;
        };
        Light.prototype.init = function (props) {
            if (props.polygon) {
                this.gfx = this.createPolygon(props.polygon, props);
            }
            this.initSize = [this.gfx.width, this.gfx.height];
            this.isCandle = props.candle == "true";
            _super.prototype.init.call(this, props);
            this.baseAlpha = this.gfx.alpha;
        };
        Light.prototype.addToScene = function () {
            var li = Application_13.Application.One.sm.findByType(Lighting_1.Lighting)[0];
            if (li) {
                li.addLight(this);
            }
        };
        Light.prototype.process = function () {
            if (this.gfx.visible) {
                if (this.isCandle) {
                    var coef = (this.gfx.height / 1640);
                    var as = Application_13.Application.One.fMath.sin(Application_13.Application.One.time / 120 + this.rndSeed / 10) * coef;
                    this.rndSeed += Math.random();
                    this.gfx.width = Light.POWER * this.initSize[0] + 8 * Application_13.Application.One.fMath.cos(Application_13.Application.One.time / 70 + this.rndSeed / 10);
                    this.gfx.height = Light.POWER * this.initSize[1] + 8 * as;
                    this.y += as;
                }
            }
            _super.prototype.process.call(this);
        };
        Light.POWER = 1;
        return Light;
    }(O_11.O));
    exports.Light = Light;
});
define("ClientSettings", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MAX_SCR_WIDTH = 640;
    exports.MAX_SCR_HEIGHT = 1024;
    exports.CAMERA_DEBUG = true;
    exports.FRAME_RATE = 60;
    exports.FRAME_DELAY = 1000 / exports.FRAME_RATE;
    exports.DEBUG = false;
});
define("Neu/BaseObjects/BaseLighting", ["require", "exports", "Neu/BaseObjects/O", "Neu/BaseObjects/Light", "Neu/Application", "main", "ClientSettings", "Neu/shaders/LightFilter"], function (require, exports, O_12, Light_2, Application_14, main_17, ClientSettings_1, LightFilter_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BaseLighting = /** @class */ (function (_super) {
        __extends(BaseLighting, _super);
        function BaseLighting() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.envColor = [1, 1, 1, 1];
            _this.envColorDark = [1, 0, 0, 0];
            _this.defaultColor = [1, 1, 1, 1];
            _this.lights = [];
            _this.illum = [0.5, 0.5, 0.5];
            return _this;
        }
        BaseLighting.prototype.onDestroy = function () {
            if (this.gfx) {
                this.gfx.filters[0].blendMode = PIXI.BLEND_MODES.NORMAL;
                this.gfx.filters = null;
                this.gfx.filterArea = null;
                Application_14.TweenMax.killTweensOf(this);
            }
            O_12.O.rp(this.ambientContainer);
            this.ambientContainer = null;
            this.ambient = null;
            this.lights = [];
            console.log("LIGHT DESTROYED");
            _super.prototype.onDestroy.call(this);
        };
        BaseLighting.prototype.addLight = function (l) {
            l.gfx.blendMode = PIXI.BLEND_MODES.ADD;
            O_12.O.rp(l.gfx);
            this.addChild(l);
        };
        BaseLighting.prototype.tweenColorTo = function (col, darkCol, deltaTimeSec) {
            if (darkCol === void 0) { darkCol = null; }
            if (deltaTimeSec === void 0) { deltaTimeSec = 0.9; }
            /*   this.lerp = 0;
               let obj: any = {
                   ease: Sine.easeOut, lerp: 1, onComplete: () => {
                       this.tweenDest = null;
                   }
               };
       
               if (repeat) {
                   obj.yoyo = true;
                   obj.repeat = -1;
               }
       
               TweenMax.to(this, deltaTimeSec, {envColor: col});
       
               if (darkCol)
               TweenMax.to(this, deltaTimeSec, {illum: darkCol});*/
        };
        BaseLighting.prototype.updateEnvironmentColor = function (col) {
        };
        BaseLighting.prototype.init = function (props) {
            _super.prototype.init.call(this, props);
            this.alwaysVisible = true;
            var delta = 0;
            this.filterArea = new PIXI.Rectangle(-delta, -delta, Application_14.Application.One.SCR_WIDTH + 2 * delta, Application_14.Application.One.SCR_HEIGHT + 2 * delta);
            this.gfx = new PIXI.Sprite();
            this.ambient = Application_14.Application.One.cs(BaseLighting.DEFAULT_GFX);
            this.ambient.anchor.x = 0.5;
            this.ambient.anchor.y = 0.5;
            this.ambient.x = Application_14.Application.One.SCR_WIDTH / 2;
            this.ambient.y = Application_14.Application.One.SCR_HEIGHT / 2;
            this.ambient.width = Application_14.Application.One.SCR_WIDTH;
            this.ambient.height = Application_14.Application.One.SCR_HEIGHT;
            this.ambientContainer = new PIXI.Container();
            this.ambientContainer.addChild(this.ambient);
            this.envColor = this.defaultColor;
            this.gfx.addChild(this.ambientContainer);
            this.layer.addChild(this.gfx);
            var lf = new LightFilter_2.LightFilter(null);
            this.layer.filters = [lf];
            this.gfx.filters = [new PIXI.filters.AlphaFilter()];
            this.gfx.filterArea = this.filterArea;
            this.gfx.filters[0].blendMode = PIXI.BLEND_MODES.MULTIPLY;
            this.redraw();
            this.updateLights();
        };
        BaseLighting.prototype.process = function () {
            this.gfx.x = -main_17._.sm.camera.x + ClientSettings_1.MAX_SCR_WIDTH / 2; //c.offset[0];
            this.gfx.y = -main_17._.sm.camera.y + ClientSettings_1.MAX_SCR_HEIGHT / 2; //c.offset[1];
            if (this.tweenDest) {
                var l = this.lerp;
                var il = 1 - this.lerp;
                this.envColor[0] = this.tweenStart[0] * il + l * this.tweenDest[0];
                this.envColor[1] = this.tweenStart[1] * il + l * this.tweenDest[1];
                this.envColor[2] = this.tweenStart[2] * il + l * this.tweenDest[2];
                this.envColor[3] = this.tweenStart[3] * il + l * this.tweenDest[3];
                this.envColorDark[0] = this.tweenStartDark[0] * il + l * this.tweenDestDark[0];
                this.envColorDark[1] = this.tweenStartDark[1] * il + l * this.tweenDestDark[1];
                this.envColorDark[2] = this.tweenStartDark[2] * il + l * this.tweenDestDark[2];
                this.envColorDark[3] = this.tweenStartDark[3] * il + l * this.tweenDestDark[3];
                this.redraw();
            }
        };
        BaseLighting.prototype.updateLights = function () {
            for (var x = 1; x < this.gfx.children.length; ++x) { //SKIP AMBIENT CONTAINER
                O_12.O.rp(x);
            }
            this.lights = Application_14.Application.One.sm.findByType(Light_2.Light);
            for (var _i = 0, _a = this.lights; _i < _a.length; _i++) {
                var x = _a[_i];
                this.addLight(x);
            }
        };
        BaseLighting.prototype.redraw = function () {
            this.gfx.color.setLight(this.envColor[1], this.envColor[2], this.envColor[3]);
            this.gfx.color.setDark(this.envColorDark[1], this.envColorDark[2], this.envColorDark[3]);
        };
        return BaseLighting;
    }(O_12.O));
    exports.BaseLighting = BaseLighting;
});
define("Neu/BaseObjects/BaseParticleSystem", ["require", "exports", "Neu/BaseObjects/O", "Neu/Application"], function (require, exports, O_13, Application_15) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BaseParticleSystem = /** @class */ (function (_super) {
        __extends(BaseParticleSystem, _super);
        function BaseParticleSystem(pos, gfx) {
            if (pos === void 0) { pos = null; }
            if (gfx === void 0) { gfx = null; }
            var _this = _super.call(this, pos, new PIXI.particles.ParticleContainer(300, {
                scale: true,
                position: true,
                rotation: true,
                uvs: true,
                tint: true,
                alpha: true,
            })) || this;
            _this.particles = [];
            _this.globalAlpha = 1;
            return _this;
        }
        BaseParticleSystem.prototype.add = function (p, gfx) {
            this.particles.push(p);
            this.gfx.addChild(gfx);
            this.processParticle(this.particles.length - 1, Application_15.Application.One.delta);
            this.width = Application_15.Application.One.SCR_WIDTH;
            this.height = Application_15.Application.One.SCR_HEIGHT;
            p.alpha = this.globalAlpha;
            return p;
        };
        BaseParticleSystem.prototype.init = function (props) {
            if (this.layer)
                this.layer.addChild(this.gfx);
            _super.prototype.init.call(this, props);
        };
        BaseParticleSystem.prototype.onDestroy = function () {
            _super.prototype.onDestroy.call(this);
        };
        BaseParticleSystem.prototype.processParticle = function (i, delta) {
            var p = this.gfx.children[i];
            var pobj = this.particles[i];
            p.x = pobj.x;
            p.y = pobj.y;
            p.alpha = pobj.alpha;
        };
        BaseParticleSystem.prototype.processParticles = function (timeDelta) {
            var len = this.particles.length;
            for (var i = 0; i < len; ++i) {
                var part = this.particles[i];
                part.lifeTime -= timeDelta;
                this.processParticle(i, timeDelta);
                if (part.lifeTime < 0) {
                    this.particles.splice(i, 1);
                    this.gfx.removeChildAt(i);
                    i--;
                    len--;
                }
            }
        };
        BaseParticleSystem.prototype.process = function () {
            _super.prototype.process.call(this);
            this.processParticles(Application_15.Application.One.deltaSec * Application_15.Application.One.timeScale);
            //TODO: WEIRD OVERRIDE VISIBLE
            this.gfx.visible = (this.parent != null) || this.alwaysVisible || ((Math.abs(this.gfx.x - Application_15.Application.One.SCR_WIDTH_HALF + this.width / 2) <= this.width / 2 + Application_15.Application.One.SCR_WIDTH_HALF) &&
                (Math.abs(this.gfx.y - Application_15.Application.One.SCR_HEIGHT_HALF) <= this.height / 2 + Application_15.Application.One.SCR_HEIGHT_HALF));
        };
        return BaseParticleSystem;
    }(O_13.O));
    exports.BaseParticleSystem = BaseParticleSystem;
    var CustomParticleSystem = /** @class */ (function (_super) {
        __extends(CustomParticleSystem, _super);
        function CustomParticleSystem() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CustomParticleSystem.prototype.processParticle = function (i, delta) {
            var p = this.gfx.children[i];
            var pobj = this.particles[i];
            if (this.customProcess) {
                this.customProcess(pobj, p);
            }
        };
        return CustomParticleSystem;
    }(BaseParticleSystem));
    exports.CustomParticleSystem = CustomParticleSystem;
});
define("Neu/BaseObjects/Tooltip", ["require", "exports", "Neu/BaseObjects/O", "Neu/Application"], function (require, exports, O_14, Application_16) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TOOLTIP_WIDTH = 260, exports.TOOLTIP_HEIGHT = 260;
    var SPACE_SIZE = 8;
    var LINE_BREAK = 18;
    var Tooltip = /** @class */ (function (_super) {
        __extends(Tooltip, _super);
        function Tooltip() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(Tooltip.prototype, "currentTip", {
            get: function () {
                return this._currentTip;
            },
            set: function (value) {
                if (this._currentTip)
                    O_14.O.rp(this._currentTip);
                if (value) {
                    Application_16.Application.One.sm.fonts.addChild(value);
                }
                else {
                    this.currentObject = null;
                }
                this._currentTip = value;
            },
            enumerable: true,
            configurable: true
        });
        Tooltip.prototype.addSpaces = function (texts, y, boundWidth) {
            var line = [];
            var total = 0;
            var spaces = 0;
            for (var _i = 0, texts_1 = texts; _i < texts_1.length; _i++) {
                var x = texts_1[_i];
                if (x.y == y) {
                    var bounds = x.getLocalBounds(x.worldTransform);
                    total += bounds.width;
                    line.push(x);
                }
            }
            for (var x = 0; x < line.length - 1; ++x) {
                spaces += SPACE_SIZE;
            }
            var addSpaces = line.length - 1;
            var freeSpace = boundWidth - (total + spaces);
            var addSpace = freeSpace / addSpaces;
            if (addSpace < 0)
                return;
            var xx = 0;
            for (var x = 0; x < line.length; ++x) {
                var tf = line[x];
                var bounds = tf.getLocalBounds(tf.worldTransform);
                tf.x = xx;
                xx += bounds.width + SPACE_SIZE + addSpace;
            }
        };
        Tooltip.prototype.createTF = function (t, fontName) {
            return new PIXI.extras.BitmapText(t, PIXI.extras.BitmapText.fonts[fontName]);
        };
        //test tooltip
        // Adds r[25% damage ] with bla bla bla
        Tooltip.prototype.makeTooltip = function (text, boundWidth, boundHeight, obj, wordToColorFunc, fontName, fontScale, center) {
            if (fontName === void 0) { fontName = 'smallfontx1'; }
            if (fontScale === void 0) { fontScale = 1; }
            if (center === void 0) { center = false; }
            var desc = new PIXI.Container();
            var lines = text.split("\n");
            var leftBorder = 22;
            var x = 0;
            var y = -25;
            var lb;
            var tags = [];
            for (var l = 0; l < lines.length; ++l) {
                var words = lines[l].split(/[\s]+/);
                for (var i = 0; i < words.length; ++i) {
                    var w = words[i];
                    if (w.length > 0 && w[2] == '{') {
                        tags.push(w.slice(0, 2));
                        w = w.slice(3);
                    }
                    if (w[0] == '}') {
                        tags.pop();
                        w = w.slice(1);
                    }
                    if (w[w.length - 1] == '}') {
                        w = w.slice(0, w.length - 1);
                    }
                    var o = wordToColorFunc(obj, w, tags);
                    if (words[i][words[i].length - 1] == '}') {
                        tags.pop();
                    }
                    var pt = this.createTF(o.word, fontName);
                    pt.font.size *= fontScale;
                    lb = pt.font.size / 2;
                    pt.tint = o.color;
                    pt.x = x;
                    pt.y = y - pt.font.size;
                    desc.addChild(pt);
                    var bounds = pt.getLocalBounds(pt.worldTransform);
                    if (pt.x + bounds.width > boundWidth) {
                        //linebreak
                        x = 0;
                        var prevY = y - pt.font.size;
                        y += lb;
                        pt.x = 0;
                        pt.y = y - pt.font.size;
                        this.addSpaces(desc.children, prevY, boundWidth);
                    }
                    x += bounds.width + SPACE_SIZE;
                }
                y += lb;
                x = 0;
            }
            for (var _i = 0, _a = desc.children; _i < _a.length; _i++) {
                var x_1 = _a[_i];
                x_1.x += leftBorder;
            }
            desc.x = this.pos[0];
            desc.y = this.pos[1];
            return desc;
        };
        return Tooltip;
    }(O_14.O));
    exports.Tooltip = Tooltip;
});
define("Neu/BaseObjects/ColorTextBox", ["require", "exports", "Neu/BaseObjects/TextBox", "Neu/BaseObjects/Tooltip", "Neu/BaseObjects/O", "Neu/Application"], function (require, exports, TextBox_5, Tooltip_1, O_15, Application_17) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Created by KURWINDALLAS on 11.07.2014.
     */ ///
    var DEFAULT_FONT = 'smallfontp';
    var ColorTextBox = /** @class */ (function (_super) {
        __extends(ColorTextBox, _super);
        function ColorTextBox() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.maxWidth = 260;
            _this.center = false;
            return _this;
        }
        Object.defineProperty(ColorTextBox.prototype, "text", {
            get: function () {
                return this._text;
            },
            set: function (value) {
                this._text = value;
                if (this.tf)
                    O_15.O.rp(this.tf);
                this.tf = this.getTextBox(value, this.tooltip, this.maxWidth);
                this.gfx.addChild(this.tf);
            },
            enumerable: true,
            configurable: true
        });
        ColorTextBox.TextColor = function (obj, word) {
            var color = 0xffffff;
            var wreturn = word;
            if (wreturn.indexOf("@red") >= 0) {
                color = 0xff0000;
                wreturn = wreturn.replace("@red", "");
            }
            return { color: color, word: wreturn };
        };
        ColorTextBox.prototype.getTextBox = function (text, tooltip, maxWidth) {
            return tooltip.makeTooltip(text, maxWidth, 260, {}, this.colorFunction, "smallfontx1", 1, this.center);
        };
        ColorTextBox.prototype.process = function () {
            _super.prototype.process.call(this);
        };
        ColorTextBox.DefaultColorFunc = function (obj, word) {
            var color = 0xffffff;
            var wreturn = word;
            if (word.indexOf('@red') == 0) {
                color = 0xff5555;
                wreturn = word.substr(4);
            }
            if (word.indexOf('@r') == 0) {
                color = 0xff5555;
                wreturn = word.substr(2);
            }
            if (word.indexOf('@l') == 0 || word.indexOf('@y') == 0) {
                color = 0xffff99;
                wreturn = word.substr(2);
            }
            return { color: color, word: wreturn };
        };
        ColorTextBox.prototype.init = function (props) {
            this.colorFunction = ColorTextBox.DefaultColorFunc;
            this.tooltip = new Tooltip_1.Tooltip([0, 0]);
            this.maxWidth = props["maxwidth"] ? props["maxwidth"] : 200;
            this.gfx = new PIXI.Container();
            this.pos[0] -= this.width / 2;
            this.pos[1] -= this.height / 2;
            this.gfx.position.x = Math.round(this.gfx.position.x);
            this.gfx.position.y = Math.round(this.gfx.position.y);
            var gfx = this.layer ? this.layer : Application_17.Application.One.sm.gui;
            gfx.addChild(this.gfx);
            this.text = props.text;
        };
        return ColorTextBox;
    }(TextBox_5.TextBox));
    exports.ColorTextBox = ColorTextBox;
});
define("Neu/BaseObjects/TextParticle", ["require", "exports", "Neu/BaseObjects/TextBox"], function (require, exports, TextBox_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TextParticle = /** @class */ (function (_super) {
        __extends(TextParticle, _super);
        function TextParticle() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TextParticle.prototype.process = function () {
            _super.prototype.process.call(this);
            this.v[1] *= 0.97;
        };
        return TextParticle;
    }(TextBox_6.TextBox));
    exports.TextParticle = TextParticle;
});
define("Neu/BaseObjects/TrainEffect", ["require", "exports", "Neu/BaseObjects/O", "Neu/Application"], function (require, exports, O_16, Application_18) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RopePoint = PIXI.heaven.mesh.RopePoint;
    var NeuRope = /** @class */ (function (_super) {
        __extends(NeuRope, _super);
        function NeuRope() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        NeuRope.prototype.addPoint = function (x, y) {
            this.verticesX++;
            this.updatePoints();
            var p = this.points[this.verticesX - 1];
            p.x = x;
            p.y = y;
        };
        NeuRope.prototype.updatePoints = function () {
            this._checkPointsLen();
        };
        return NeuRope;
    }(PIXI.heaven.mesh.Rope));
    exports.NeuRope = NeuRope;
    var TrainEffect = /** @class */ (function (_super) {
        __extends(TrainEffect, _super);
        function TrainEffect() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.pos2 = [0, 0];
            _this.pointsEnabled = 0;
            _this.pointFunc = function (c, prop) {
            };
            _this.lastHistoryX = Infinity;
            _this.lastHistoryY = Infinity;
            _this.delta = 4;
            return _this;
        }
        TrainEffect.prototype.init = function (props) {
            if (props === void 0) { props = null; }
            this.points = [];
            this.totalPoints = props.totalPoints ? props.totalPoints : 40;
            this.historyX = [];
            this.historyY = [];
            if (!props.scaleX)
                props.scaleX = 1;
            if (!props.scaleY)
                props.scaleY = 1;
            this.points.push(new RopePoint(this.pos[0] / props.scaleX, this.pos[1] / props.scaleY));
            //for (let x = 0; x < this.totalPoints; x++) {
            //    this.points.push(new RopePoint(this.pos[0] / props.scaleX, this.pos[1] / props.scaleY))
            // }
            this.historyPoints = props.historyPoints ? props.historyPoints : 40;
            this.historyX.push((this.pos[0]) / props.scaleX);
            this.historyY.push((this.pos[1]) / props.scaleY);
            //  for (let i = 0; i < this.historyPoints; i++) {
            //      this.historyX.push((this.pos[0] - 0.5*(this.historyPoints - i - 1))/ props.scaleX);
            //      this.historyY.push((this.pos[1] - 0.5*(this.historyPoints - i - 1)) / props.scaleY);
            //  }
            var trailTexture = PIXI.Texture.fromImage(props.gfx);
            //ANUS
            this.gfx = new NeuRope(trailTexture, this.points);
            this.gfx.enableColors();
            this.gfx.drawMode = PIXI.heaven.mesh.Mesh.DRAW_MODES.TRIANGLES;
            this.gfx.scale.x = props.scaleX;
            this.gfx.scale.y = props.scaleY;
            this.gfx.blendMode = props.blendmode;
            props.layer.addChild(this.gfx);
            Application_18.Application.One.sm.camera.transformPoint([0, 0], 1, this.pos2);
        };
        TrainEffect.prototype.process = function () {
            var curHistoryX = this.pos[0] / this.gfx.scale.x;
            var curHistoryY = this.pos[1] / this.gfx.scale.y;
            if (Math.abs(this.lastHistoryX - curHistoryX) > this.delta &&
                Math.abs(this.lastHistoryY - curHistoryY) > this.delta) {
                this.lastHistoryY = curHistoryY;
                this.lastHistoryX = curHistoryX;
                if (this.historyX.length >= this.historyPoints) {
                    this.historyX.pop();
                }
                this.historyX.unshift(curHistoryX);
                if (this.historyY.length >= this.historyPoints) {
                    this.historyY.pop();
                }
                this.historyY.unshift(curHistoryY);
                this.pointsEnabled++;
            }
            else {
                this.historyX[0] = curHistoryX;
                this.historyY[0] = curHistoryY;
            }
            if (this.gfx.verticesX < this.totalPoints) {
                this.gfx.addPoint(this.pos[0] / this.gfx.scale.x, this.pos[1] / this.gfx.scale.y);
            }
            var points = this.gfx.points;
            for (var i = 0; i < points.length; i++) {
                var p = points[i];
                var prop = i / (points.length - 1);
                this.pointFunc(p, prop);
                var ix = cubicInterpolation(this.historyX, i / points.length * this.historyPoints);
                var iy = cubicInterpolation(this.historyY, i / points.length * this.historyPoints);
                p.x = ix;
                p.y = iy;
            }
            //console.log(this.historyX.length, ' ', points.length)
            this.x += this.v[0]; // * Application.One.worldSpeed * Application.One.delta2;
            this.y += this.v[1]; // * Application.One.worldSpeed * Application.One.delta2;
            if (!this.noCameraOffset) {
                Application_18.Application.One.sm.camera.transformPoint([0, 0], 1, this.pos2);
                this.gfx.x = this.pos2[0];
                this.gfx.y = this.pos2[1];
            }
        };
        TrainEffect.prototype.onDestroy = function () {
            this.pointFunc = null;
            this.historyX = null;
            this.historyY = null;
            this.points = null;
            _super.prototype.onDestroy.call(this);
        };
        return TrainEffect;
    }(O_16.O));
    exports.TrainEffect = TrainEffect;
    function clipInput(k, arr, maxL) {
        if (k < 0)
            k = 0;
        if (k > maxL - 1)
            k = maxL - 1;
        return arr[k];
    }
    function getTangent(k, array, maxL) {
        return (clipInput(k + 1, array, maxL) - clipInput(k - 1, array, maxL)) / 2;
    }
    function cubicInterpolation(array, t) {
        var maxL = array.length;
        var k = Math.floor(t);
        var m = [getTangent(k, array, maxL), getTangent(k + 1, array, maxL)];
        var p = [clipInput(k, array, maxL), clipInput(k + 1, array, maxL)];
        t -= k;
        var t2 = t * t;
        var t3 = t * t2;
        return (2 * t3 - 3 * t2 + 1) * p[0] + (t3 - 2 * t2 + t) * m[0] + (-2 * t3 + 3 * t2) * p[1] + (t3 - t2) * m[1];
    }
});
define("ObjectsList", ["require", "exports", "Objects/AngryBar", "Objects/ButtonTool", "Objects/Problem", "Objects/ScrollBox", "Objects/ToolsBar", "Neu/BaseObjects/Aligner", "Neu/BaseObjects/BaseLighting", "Neu/BaseObjects/BaseParticleSystem", "Neu/BaseObjects/Button", "Neu/BaseObjects/Camera", "Neu/BaseObjects/ColorTextBox", "Neu/BaseObjects/IO", "Neu/BaseObjects/Light", "Neu/BaseObjects/Lighting", "Neu/BaseObjects/O", "Neu/BaseObjects/TextBox", "Neu/BaseObjects/TextParticle", "Neu/BaseObjects/Tooltip", "Neu/BaseObjects/TrainEffect"], function (require, exports, AngryBar_3, ButtonTool_2, Problem_2, ScrollBox_1, ToolsBar_2, Aligner_1, BaseLighting_2, BaseParticleSystem_1, Button_2, Camera_2, ColorTextBox_1, IO_3, Light_3, Lighting_2, O_17, TextBox_7, TextParticle_1, Tooltip_2, TrainEffect_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ObjectNames = {
        AngryBar: AngryBar_3.AngryBar,
        ButtonTool: ButtonTool_2.ButtonTool,
        Problem: Problem_2.Problem,
        ScrollBox: ScrollBox_1.ScrollBox,
        ToolsBar: ToolsBar_2.ToolsBar,
        Aligner: Aligner_1.Aligner,
        BaseLighting: BaseLighting_2.BaseLighting,
        BaseParticleSystem: BaseParticleSystem_1.BaseParticleSystem,
        Button: Button_2.Button,
        Camera: Camera_2.Camera,
        ColorTextBox: ColorTextBox_1.ColorTextBox,
        IO: IO_3.IO,
        Light: Light_3.Light,
        Lighting: Lighting_2.Lighting,
        O: O_17.O,
        TextBox: TextBox_7.TextBox,
        TextParticle: TextParticle_1.TextParticle,
        Tooltip: Tooltip_2.Tooltip,
        TrainEffect: TrainEffect_1.TrainEffect,
    };
    exports.LevelNames = [
        "levels/elektri4ka.tsx",
        "levels/gameui.tmx",
        "levels/menu.tmx",
        "levels/rules.tmx",
        "levels/scores.tmx",
        "levels/winmodal.tmx",
    ];
});
define("Neu/Loader", ["require", "exports", "Neu/BaseObjects/O", "Neu/Math", "ObjectsList", "Neu/Application"], function (require, exports, O_18, Math_7, ObjectsList_1, Application_19) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FLIPPED_HORIZONTALLY_FLAG = 0x80000000;
    var FLIPPED_VERTICALLY_FLAG = 0x40000000;
    var FLIPPED_DIAGONALLY_FLAG = 0x20000000;
    for (var x in ObjectsList_1.ObjectNames) {
        ObjectsList_1.ObjectNames[x.toLowerCase()] = ObjectsList_1.ObjectNames[x];
    }
    function extractBlendMode(bm) {
        switch (bm) {
            case 'normal':
                return PIXI.BLEND_MODES.NORMAL;
                break;
            case 'add':
                return PIXI.BLEND_MODES.ADD;
                break;
            case 'multiply':
                return PIXI.BLEND_MODES.MULTIPLY;
                break;
            case 'screen':
                return PIXI.BLEND_MODES.SCREEN;
                break;
            case 'overlay':
                return PIXI.BLEND_MODES.OVERLAY;
                break;
            case 'darken':
                return PIXI.BLEND_MODES.DARKEN;
                break;
            case 'dodge':
                return PIXI.BLEND_MODES.COLOR_DODGE;
                break;
            case 'burn':
                return PIXI.BLEND_MODES.COLOR_BURN;
                break;
            case 'hardlight':
                return PIXI.BLEND_MODES.HARD_LIGHT;
                break;
            case 'softlight':
                return PIXI.BLEND_MODES.SOFT_LIGHT;
                break;
            case 'difference':
                return PIXI.BLEND_MODES.DIFFERENCE;
                break;
            case 'exclusion':
                return PIXI.BLEND_MODES.EXCLUSION;
                break;
            case 'hue':
                return PIXI.BLEND_MODES.HUE;
                break;
            case 'saturation':
                return PIXI.BLEND_MODES.SATURATION;
                break;
            case 'color':
                return PIXI.BLEND_MODES.COLOR;
                break;
            case 'luminosity':
                return PIXI.BLEND_MODES.LUMINOSITY;
                break;
        }
        return PIXI.BLEND_MODES.NORMAL;
    }
    exports.extractBlendMode = extractBlendMode;
    var Loader = /** @class */ (function () {
        function Loader() {
            this.loading = false;
            this.levels = {};
            this.tilesets = {};
        }
        Loader.prototype.removeExt = function (t) {
            return t.replace(/\.[^/.]+$/, "");
        };
        Loader.prototype.add = function (name, data) {
            this.levels[name] = data;
        };
        Loader.extractShortSrc = function (src) {
            src = src.substring(src.lastIndexOf("\\") + 1);
            return src;
        };
        Loader.addGfxToWorld = function (stage, layerName) {
            if (layerName == 'gui')
                return Application_19.Application.One.sm.gui;
            if (layerName == 'gui2')
                return Application_19.Application.One.sm.gui2;
            if (layerName == 'olgui')
                return Application_19.Application.One.sm.olgui;
            if (layerName == 'light')
                return Application_19.Application.One.sm.light;
            return stage.layers[layerName.toLowerCase()];
        };
        Loader.val = function (obj, tag) {
            var el = obj.getElementsByTagName(tag);
            if (!el.length)
                return;
            return el[0].textContent;
        };
        ///Idea is to load all the objects
        //then translate O to owner gfx
        Loader.prototype.loadToObject = function (stage, name, group, object) {
            var a = this.load(stage, name, null, null, null, group, true, false);
            var list = [];
            this.init(a, false);
            for (var _i = 0, a_1 = a; _i < a_1.length; _i++) {
                var x = a_1[_i];
                if (x.gfx) {
                    object.addChild(x);
                }
                list.push(x);
                /*if (x.constructor == O && x.gfx) {
                               O.rp(x.gfx);
                                object.gfx.addChild(x.gfx);
                               x.gfx = null;
                               x.killNow();
                           } else {
                               list.push(x)
                           }*/
            }
            return list;
        };
        Loader.prototype.loadToContainer = function (stage, name, cb, noCameraOffset, offs, group) {
            if (noCameraOffset === void 0) { noCameraOffset = false; }
            if (offs === void 0) { offs = null; }
            if (group === void 0) { group = null; }
            var c = new PIXI.Container();
            var a = this.load(stage, name, cb, noCameraOffset, offs, group);
            for (var _i = 0, a_2 = a; _i < a_2.length; _i++) {
                var x = a_2[_i];
                if (x.gfx) {
                    O_18.O.rp(x.gfx);
                    c.addChild(x.gfx);
                }
            }
            return { list: a, container: c };
        };
        Loader.prototype.shouldAppear = function (c) {
            var properties = c.getElementsByTagName('properties')[0];
            if (properties) {
                var propertyArray = properties.getElementsByTagName('property');
                for (var _i = 0, propertyArray_1 = propertyArray; _i < propertyArray_1.length; _i++) {
                    var p = propertyArray_1[_i];
                    if (p.attributes.getNamedItem('name').nodeValue.toLowerCase() == 'appear') {
                        var prob = parseFloat(p.attributes.getNamedItem('value').nodeValue);
                        if (Math.random() * 100 > prob)
                            return false;
                    }
                }
            }
            return true;
        };
        Loader.prototype.load = function (stage, name, preInitCB, noCameraOffset, offs, restrictGroup, addObjects, doInit) {
            var _this = this;
            if (preInitCB === void 0) { preInitCB = null; }
            if (noCameraOffset === void 0) { noCameraOffset = false; }
            if (offs === void 0) { offs = null; }
            if (restrictGroup === void 0) { restrictGroup = null; }
            if (addObjects === void 0) { addObjects = true; }
            if (doInit === void 0) { doInit = true; }
            this.loading = true;
            var data = this.levels[name];
            if (!data) {
                throw 'No such level as ' + name;
                console.log('No such level as ', name);
                return;
            }
            var bigtilesets = [];
            var images = {};
            var map = this.levels[name].getElementsByTagName("map")[0];
            var tw = parseFloat(map.attributes.getNamedItem('tilewidth').nodeValue);
            var th = parseFloat(map.attributes.getNamedItem('tileheight').nodeValue);
            var objectsList = [];
            var globalProperties = this.getProps(map);
            if (addObjects)
                this.updateGlobalMapParams(globalProperties);
            var tilesets = map.getElementsByTagName("tileset");
            for (var _i = 0, tilesets_1 = tilesets; _i < tilesets_1.length; _i++) {
                var t = tilesets_1[_i];
                var firstgid = t.attributes.getNamedItem('firstgid') ? t.attributes.getNamedItem('firstgid').nodeValue : 0;
                var sourceAttr = t.attributes.getNamedItem('source');
                if (sourceAttr) {
                    var source = sourceAttr.nodeValue;
                    var sourceNoExt = source.substring(0, source.length - 4);
                    t = this.tilesets[sourceNoExt].childNodes[0];
                }
                var tilecount = t.attributes.getNamedItem('tilecount').nodeValue;
                var columns = t.attributes.getNamedItem('columns').nodeValue;
                var tiles = t.getElementsByTagName('tile');
                if (!tiles[0]) {
                    var img = t.getElementsByTagName('image')[0];
                    if (img)
                        bigtilesets.push({
                            firstgid: firstgid,
                            tilecount: tilecount,
                            tw: tw,
                            th: th,
                            columns: columns,
                            texname: img.attributes.getNamedItem('source').nodeValue,
                        });
                }
                else {
                    for (var _a = 0, tiles_1 = tiles; _a < tiles_1.length; _a++) {
                        var t_1 = tiles_1[_a];
                        var img = t_1.getElementsByTagName('image')[0];
                        if (!img)
                            continue;
                        var watr = img.attributes.getNamedItem('width');
                        var hatr = img.attributes.getNamedItem('height');
                        var sourceattr = img.attributes.getNamedItem('source');
                        images[parseInt(t_1.attributes.getNamedItem('id').nodeValue) + parseInt(firstgid)] = {
                            tilesetWidth: tw,
                            tilesetHeight: th,
                            width: watr ? watr.nodeValue : 0,
                            height: hatr ? hatr.nodeValue : 0,
                            source: sourceattr.nodeValue.replace(/^.*[\\\/]/, ''),
                        };
                    }
                }
            }
            var addObjectsFunc = function (c, ox, oy) {
                if (c.nodeName == 'layer') {
                    var name_1 = c.attributes.getNamedItem('name').nodeValue.toLowerCase();
                    var ofsXattr = c.attributes.getNamedItem('offsetx');
                    var ofsYattr = c.attributes.getNamedItem('offsety');
                    var offset = [ofsXattr ? parseFloat(ofsXattr.nodeValue) : 0, ofsYattr ? parseFloat(ofsYattr.nodeValue) : 0];
                    offset[0] += ox;
                    offset[1] += oy;
                    var layerProps = _this.getProps(c);
                    if (!stage.layers[name_1]) {
                        stage.addLayer(name_1, null);
                    }
                    if (!_this.shouldAppear(c)) {
                        return;
                    }
                    if (addObjects)
                        objectsList = objectsList.concat(_this.addLayer(stage, c, bigtilesets, images, offset, layerProps));
                }
                if (c.nodeName == 'objectgroup') {
                    var layerProps = _this.getProps(c);
                    var name_2 = c.attributes.getNamedItem('name').nodeValue.toLowerCase();
                    if (!stage.layers[name_2]) {
                        stage.addLayer(name_2, null);
                    }
                    if (!_this.shouldAppear(c)) {
                        return;
                    }
                    if (addObjects)
                        objectsList = objectsList.concat(_this.addObjectGroup(stage, c, images, layerProps));
                }
            };
            var haveRestrictedGroup = false;
            for (var _b = 0, _c = map.childNodes; _b < _c.length; _b++) {
                var c = _c[_b];
                if (c.nodeName == 'group' && (!restrictGroup || c.attributes.getNamedItem('name').nodeValue.toLowerCase() == restrictGroup.toLowerCase())) {
                    var offsXattr = c.attributes.getNamedItem('offsetx');
                    var offsYattr = c.attributes.getNamedItem('offsety');
                    var ox = offsXattr ? parseFloat(offsXattr.nodeValue) : 0;
                    var oy = offsYattr ? parseFloat(offsYattr.nodeValue) : 0;
                    haveRestrictedGroup = true;
                    for (var _d = 0, _e = c.childNodes; _d < _e.length; _d++) {
                        var x = _e[_d];
                        addObjectsFunc(x, ox, oy);
                    }
                }
                else {
                    addObjectsFunc(c, 0, 0);
                }
            }
            if (restrictGroup != null && !haveRestrictedGroup) {
                throw "No such restricted group";
            }
            if (offs != null) {
                for (var _f = 0, objectsList_1 = objectsList; _f < objectsList_1.length; _f++) {
                    var x = objectsList_1[_f];
                    x.pos[0] += offs[0];
                    x.pos[1] += offs[1];
                }
            }
            this.objectsList = objectsList;
            //let startLoad = (new Date()).getTime();
            if (preInitCB)
                preInitCB(objectsList, globalProperties);
            if (doInit)
                this.init(objectsList, noCameraOffset);
            this.objectsList = null;
            this.loading = false;
            return objectsList;
        };
        Loader.prototype.getProps = function (node) {
            var globalProperties = [];
            var props;
            for (var _i = 0, _a = node.childNodes; _i < _a.length; _i++) {
                var pchildren = _a[_i];
                if (pchildren.nodeName == 'properties') {
                    props = pchildren;
                    break;
                }
            }
            if (props) {
                var propertyArray = props.childNodes;
                for (var _b = 0, propertyArray_2 = propertyArray; _b < propertyArray_2.length; _b++) {
                    var p = propertyArray_2[_b];
                    if (p.nodeName == 'property')
                        globalProperties[p.attributes.getNamedItem('name').nodeValue] = p.attributes.getNamedItem('value').nodeValue;
                }
            }
            return globalProperties;
        };
        Loader.prototype.addObjectGroup = function (stage, objectGroup, images, layerProps) {
            var objectsList = [];
            var name = objectGroup.attributes.getNamedItem('name').nodeValue;
            var ofsXattr = objectGroup.attributes.getNamedItem('offsetx');
            var ofsYattr = objectGroup.attributes.getNamedItem('offsety');
            var offsetx = ofsXattr ? parseFloat(ofsXattr.nodeValue) : 0;
            var offsety = ofsYattr ? parseFloat(ofsYattr.nodeValue) : 0;
            var objects = objectGroup.getElementsByTagName('object');
            for (var _i = 0, objects_2 = objects; _i < objects_2.length; _i++) {
                var o = objects_2[_i];
                var gidAttr = o.attributes.getNamedItem('gid');
                var gid = gidAttr ? parseInt(gidAttr.nodeValue) : -1;
                var flipped_horizontally = false;
                var flipped_vertically = false;
                var textureName = void 0;
                var image = void 0;
                if (gid > 0) {
                    flipped_horizontally = (gid & FLIPPED_HORIZONTALLY_FLAG) == -FLIPPED_HORIZONTALLY_FLAG;
                    flipped_vertically = (gid & FLIPPED_VERTICALLY_FLAG) == FLIPPED_VERTICALLY_FLAG;
                    if (flipped_horizontally)
                        gid &= ~FLIPPED_HORIZONTALLY_FLAG;
                    if (flipped_vertically)
                        gid &= ~FLIPPED_VERTICALLY_FLAG;
                    image = images[gid];
                    if (!image) {
                        console.log("Can't load texture with Tile Id: ", gid);
                    }
                    else {
                        textureName = image.source;
                        if (Loader.SkipSpriteExt) {
                            textureName = this.removeExt(textureName);
                        }
                    }
                }
                var oo = this.createObject(stage, o, textureName, offsetx, offsety, image ? image.source : null, name, layerProps, flipped_horizontally, flipped_vertically);
                if (oo)
                    objectsList.push(oo);
            }
            if (layerProps["color"])
                this.setLayerColor(objectsList, layerProps["color"]);
            if (layerProps["light"])
                this.setLayerLightColor(objectsList, layerProps["light"]);
            return objectsList;
        };
        Loader.prototype.createGfx = function (o, textureName, x, y, frameName, properties) {
            var w = o.attributes.getNamedItem('width').nodeValue;
            var h = o.attributes.getNamedItem('height').nodeValue;
            var gfx;
            if (properties['movieclip'] == 'true') {
                var noExtensionFrameName = frameName.replace(/\.[^/.]+$/, "");
                var noDigitsFrameName = noExtensionFrameName.replace(/[0-9]/g, '');
                gfx = Application_19.Application.One.cm(noDigitsFrameName);
                if (properties['randomstart'] == 'true') {
                    gfx.gotoAndPlay(Math_7.m.rint(0, gfx.totalFrames - 1));
                }
                else {
                    gfx.gotoAndPlay(0);
                }
                gfx.loop = true;
                gfx.animationSpeed = 0.35;
            }
            else {
                //TODO: camera
                gfx = Application_19.Application.One.cs(textureName);
            }
            gfx.anchor.x = .5;
            gfx.anchor.y = .5;
            gfx.width = w;
            gfx.height = h;
            gfx.position.x = 0;
            gfx.position.y = 0;
            gfx.alpha = properties['alpha'] ? properties['alpha'] : 1;
            if (properties['blendMode']) {
                gfx.blendMode = extractBlendMode(properties['blendMode'].toLowerCase());
            }
            return gfx;
        };
        Loader.prototype.createObject = function (stage, o, textureName, offsetx, offsety, frameName, layerName, groupProps, flipX, flipY) {
            var id = o.attributes.getNamedItem('id').value;
            var x = parseFloat(o.attributes.getNamedItem('x').nodeValue);
            var y = parseFloat(o.attributes.getNamedItem('y').nodeValue);
            var watr = o.attributes.getNamedItem('width');
            var hatr = o.attributes.getNamedItem('height');
            var w = watr ? parseFloat(watr.nodeValue) : 0;
            var h = hatr ? parseFloat(hatr.nodeValue) : 0;
            var nameAttr = o.attributes.getNamedItem('name');
            var typeAttr = o.attributes.getNamedItem('type');
            var rotAttr = o.attributes.getNamedItem('rotation');
            var name = nameAttr ? nameAttr.nodeValue : '';
            var type = typeAttr ? typeAttr.nodeValue : '';
            var rot = rotAttr ? rotAttr.nodeValue : 0;
            rot = Math.PI * (rot / 180);
            //DO THIS ONLY FOR GFX SPRITES
            var offsetVec;
            if (textureName) {
                offsetVec = [w / 2, -h / 2];
            }
            else {
                offsetVec = [w / 2, h / 2];
            }
            offsetVec = Math_7.m.rv2(offsetVec, rot);
            x += offsetVec[0];
            y += offsetVec[1];
            var polylines = o.getElementsByTagName('polyline');
            var polyline;
            if (polylines.length > 0)
                polyline = polylines[0];
            var polygons = o.getElementsByTagName('polygon');
            var polygon;
            if (polygons.length > 0)
                polygon = polygons[0];
            var props = o.getElementsByTagName('property');
            var properties = {};
            for (var _i = 0, props_1 = props; _i < props_1.length; _i++) {
                var x_2 = props_1[_i];
                var name_3 = x_2.attributes.getNamedItem('name').nodeValue;
                var valattr = x_2.attributes.getNamedItem('value');
                properties[name_3] = valattr ? valattr.nodeValue : x_2.textContent;
            }
            for (var x_3 in groupProps) {
                properties[x_3] = groupProps[x_3];
            }
            if (properties.server)
                return;
            var className = '';
            if (properties["type"])
                className = properties["type"];
            if (type != '') {
                className = type;
            }
            if (properties["singleton"] == 'true') {
                //UniqueCheck
                if (ObjectsList_1.ObjectNames[className] && Application_19.Application.One.sm.findByType(ObjectsList_1.ObjectNames[className]).length > 0) {
                    return null;
                }
            }
            var obj;
            var startPos = [x + offsetx, y + offsety];
            if (className && className.toLowerCase() == 'skip') {
                return null;
            }
            if (className != '') {
                if (!ObjectsList_1.ObjectNames[className]) {
                    console.log('[LevelManager] Cant find class: ', className);
                }
                obj = new (ObjectsList_1.ObjectNames[className])(startPos);
            }
            else {
                obj = new O_18.O(startPos);
            }
            obj.stringID = name;
            if (polygon) {
                properties["polygon"] = polygon.attributes.getNamedItem('points').nodeValue;
            }
            if (polyline) {
                properties["polyline"] = polyline.attributes.getNamedItem('points').nodeValue;
            }
            obj.polygon = properties['polygon'];
            obj.polyline = properties['polyline'];
            if (textureName) { //has gfx
                obj.gfx = this.createGfx(o, textureName, 0, 0, frameName, properties);
            }
            var visibility = properties['visible'] == 'false' ? false : true;
            if (obj.gfx)
                obj.gfx.visible = visibility;
            var layer = Loader.addGfxToWorld(stage, layerName);
            obj.layer = layer;
            if (obj.gfx)
                layer.addChild(obj.gfx);
            if (obj.gfx) {
                if (flipX)
                    obj.gfx.scale.x = -obj.gfx.scale.x;
                if (flipY) {
                    obj.gfx.scale.y = -obj.gfx.scale.y;
                }
                obj.gfx.rotation = rot;
            }
            obj.a = rot;
            obj.width = w;
            obj.height = h;
            obj.properties = properties;
            return obj;
        };
        Loader.prototype.addLayer = function (stage, layer, bigtilesets, images, offset, layerProps) {
            var objectsList = [];
            var data = layer.getElementsByTagName('data')[0];
            var str = data.textContent;
            str = str.replace(/\r?\n|\r/g, '');
            var name = layer.attributes.getNamedItem('name').nodeValue;
            var arr = str.split(',');
            var len = arr.length;
            var layerWidth = layer.attributes.getNamedItem('width').nodeValue;
            var layerHeight = layer.attributes.getNamedItem('height').nodeValue;
            for (var i = 0; i < len; i++) {
                if (arr[i] > 0) {
                    var textureName = void 0;
                    var tileID = arr[i];
                    if (images[tileID]) {
                        textureName = images[tileID].source;
                    }
                    else {
                        for (var _i = 0, bigtilesets_1 = bigtilesets; _i < bigtilesets_1.length; _i++) {
                            var bt = bigtilesets_1[_i];
                            if (bt.firstgid >= tileID && tileID < bt.firstgid + bt.tilecount) {
                                break;
                            }
                        }
                        if (!bt)
                            continue;
                        textureName = bt.texname;
                    }
                    if (Loader.SkipSpriteExt) {
                        textureName = this.removeExt(textureName);
                    }
                    var col = Math.floor(i % layerWidth);
                    var row = Math.floor(i / layerWidth);
                    var posX = col * images[tileID].tilesetWidth;
                    var posY = row * images[tileID].tilesetHeight - (parseFloat(images[tileID].height) - images[tileID].tilesetHeight);
                    var type = layerProps['type'];
                    var layername = layerProps['name'];
                    var o = this.spawnTile(stage, textureName, posX + offset[0], posY + offset[1], name, type, layername, col, row);
                    o.properties = layerProps;
                    objectsList.push(o);
                }
            }
            if (layerProps["color"])
                this.setLayerColor(objectsList, layerProps["color"]);
            if (layerProps["light"])
                this.setLayerLightColor(objectsList, layerProps["light"]);
            return objectsList;
        };
        Loader.prototype.spawnTile = function (stage, textureName, posX, posY, layerName, type, layerStringID, col, row) {
            var sprite = Application_19.Application.One.cs(textureName);
            sprite.anchor.x = 0.5;
            sprite.anchor.y = 0.5;
            var o;
            if (type && type != '') {
                o = new ObjectsList_1.ObjectNames[type.toLowerCase()]([posX, posY]);
            }
            else {
                o = new O_18.O([posX, posY]);
            }
            o.x += sprite.width / 2;
            o.y += sprite.height / 2;
            o.tileColRow = [col, row];
            o.stringID = layerStringID;
            o.gfx = sprite;
            var layer = Loader.addGfxToWorld(stage, layerName);
            o.layer = layer;
            layer.addChild(sprite);
            return o;
        };
        Loader.prototype.init = function (list, noCameraOffset) {
            for (var _i = 0, list_8 = list; _i < list_8.length; _i++) {
                var o = list_8[_i];
                o.noCameraOffset = noCameraOffset;
                o.init(o.properties);
            }
        };
        Loader.prototype.getGroups = function (level, filter) {
            if (filter === void 0) { filter = null; }
            var map = this.levels[level].getElementsByTagName("map")[0];
            var arr = [];
            for (var _i = 0, _a = map.childNodes; _i < _a.length; _i++) {
                var c = _a[_i];
                if (c.nodeName == 'group') {
                    var name_4 = c.attributes.name.value.toLowerCase();
                    if (!filter) {
                        arr.push(name_4);
                    }
                    else {
                        if (~name_4.indexOf(filter)) {
                            arr.push(name_4);
                        }
                    }
                }
            }
            return arr;
        };
        Loader.prototype.setLayerLightColor = function (objectsList, color) {
            for (var _i = 0, objectsList_2 = objectsList; _i < objectsList_2.length; _i++) {
                var x = objectsList_2[_i];
                if (x.gfx && x.gfx.color) {
                    var col = Math_7.m.strhexToRgbNormal(color);
                    x.gfx.color.setDark(col[0], col[1], col[2]);
                }
            }
        };
        Loader.prototype.setLayerColor = function (objectsList, color) {
            for (var _i = 0, objectsList_3 = objectsList; _i < objectsList_3.length; _i++) {
                var x = objectsList_3[_i];
                if (x.gfx && x.gfx.color) {
                    var col = Math_7.m.strhexToRgbNormal(color);
                    x.gfx.color.setLight(col[0], col[1], col[2]);
                }
            }
        };
        Loader.prototype.loadLayersFromLevelGroup = function (stage, level, group) {
            this.load(stage, level, null, false, null, group, false);
        };
        Loader.prototype.loadGFXonly = function (stage, level, offs, container) {
            var list = this.load(stage, level, null, false, offs, null, true, false);
            var retList = [];
            for (var _i = 0, list_9 = list; _i < list_9.length; _i++) {
                var x = list_9[_i];
                if (x.gfx) {
                    O_18.O.rp(x.gfx);
                    x.gfx.x = x.x;
                    x.gfx.y = x.y;
                    container.addChild(x.gfx);
                    retList.push(x.gfx);
                    x.gfx = null;
                }
            }
            Application_19.Application.One.sm.removeList(list);
            return retList;
        };
        Loader.prototype.addTileset = function (result, data) {
            this.tilesets[result] = data;
        };
        Loader.prototype.updateGlobalMapParams = function (globalProperties) {
            if (this.customGlobalParamsCallback) {
                this.customGlobalParamsCallback(globalProperties);
            }
        };
        Loader.SkipSpriteExt = false;
        return Loader;
    }());
    exports.Loader = Loader;
});
/**
 * Created by MSI on 06.05.2017.
 */
define("Neu/Controls", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Created by MSI on 12.03.2017.
     */
    var Controls = /** @class */ (function () {
        function Controls() {
            var _this = this;
            this.buttonStates = {};
            var nav = navigator;
            var gamepads = navigator.getGamepads ? navigator.getGamepads() : (nav.webkitGetGamepads ? nav.webkitGetGamepads : []);
            this.gp = gamepads[0];
            window.addEventListener("gamepaddisconnected", function (e) {
                _this.gp = null;
            }, false);
            window.addEventListener("gamepadconnected", function (e) {
                if (e.gamepad) {
                    _this.gp = navigator.getGamepads()[e.gamepad.index];
                    console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.", _this.gp.index, _this.gp.id, _this.gp.buttons.length, _this.gp.axes.length);
                }
                else {
                    _this.gp = null;
                }
            });
        }
        Controls.prototype.buttonPressed = function (b) {
            if (typeof (b) == "object") {
                return b.pressed;
            }
            return b == 1.0;
        };
        Controls.prototype.onJoystickButtonPress = function (btn, state) {
            if (state) {
                if (this.onBtnPress)
                    this.onBtnPress(btn);
                if (this.onBtnRelease)
                    this.onBtnRelease(btn);
            }
        };
        Controls.prototype.update = function () {
            var nav = navigator;
            var gamepads = navigator.getGamepads ? navigator.getGamepads() : (nav.webkitGetGamepads ? nav.webkitGetGamepads : []);
            this.gp = gamepads[0];
            if (this.gp) {
                if (this.gp.axes[0] != this.prevX && this.gp.axes[0] > .99 && this.onRight)
                    this.onRight();
                if (this.gp.axes[0] != this.prevX && this.gp.axes[0] < -.99 && this.onLeft)
                    this.onLeft();
                if (this.gp.axes[1] != this.prevY && this.gp.axes[1] > .99 && this.onUp)
                    this.onUp();
                if (this.gp.axes[1] != this.prevY && this.gp.axes[1] < -.99 && this.onDown)
                    this.onDown();
                this.prevX = this.gp.axes[0];
                this.prevY = this.gp.axes[1];
                for (var x = 0; x < this.gp.buttons.length; ++x) {
                    var newBtnState = this.buttonPressed(this.gp.buttons[x]);
                    if (newBtnState != this.buttonStates[x]) {
                        this.onJoystickButtonPress(x, newBtnState);
                    }
                    this.buttonStates[x] = newBtnState;
                }
            }
        };
        return Controls;
    }());
    exports.Controls = Controls;
});
define("Neu/PauseTimer", ["require", "exports", "main", "Neu/Application"], function (require, exports, main_18, Application_20) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PauseTimer = /** @class */ (function () {
        function PauseTimer() {
            this.paused = false;
            this.pauseStart = 0;
            this.totalPauseTime = 0;
            this.intervals = [];
            this.timeouts = [];
        }
        PauseTimer.prototype.since = function (time) {
            return this.getTimer() - time;
        };
        PauseTimer.prototype.process = function () {
        };
        PauseTimer.prototype.removeListener = function (f) {
            for (var i = 0; i < this.intervals.length; ++i) {
                if (this.intervals[i] == f) {
                    this.intervals.splice(i, 1);
                    i--;
                }
            }
            for (var i = 0; i < this.timeouts.length; ++i) {
                if (this.timeouts[i] == f) {
                    this.timeouts.splice(i, 1);
                    i--;
                }
            }
        };
        PauseTimer.prototype.getTimer = function () {
            return main_18._.time - this.totalPauseTime;
        };
        PauseTimer.prototype.isPaused = function () {
            return this.paused;
        };
        PauseTimer.prototype.pause = function () {
            this.pauseStart = main_18._.time;
            Application_20.TweenMax.pauseAll();
            this.paused = true;
        };
        PauseTimer.prototype.resume = function () {
            if (!this.paused)
                return;
            this.totalPauseTime += (main_18._.time - this.pauseStart);
            Application_20.TweenMax.resumeAll();
            this.paused = false;
        };
        return PauseTimer;
    }());
    exports.PauseTimer = PauseTimer;
});
define("Neu/Sound", ["require", "exports", "Neu/Math"], function (require, exports, Math_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SOUND_PATH = 'sound/';
    var MUSIC_PATH = 'music/';
    var Sound = /** @class */ (function () {
        function Sound() {
            this._enabled = true;
            this.loaded = 0;
            this.total = 0;
            this.musicInstance = null;
            this.ready = false;
            this.soundsPlaying = [];
            this.loadingCallbacks = [];
        }
        Object.defineProperty(Sound.prototype, "enabled", {
            get: function () {
                return this._enabled;
            },
            set: function (e) {
                this._enabled = e;
            },
            enumerable: true,
            configurable: true
        });
        Sound.prototype.lazyPlayMusic = function (fullName, volume, pos) {
            var _this = this;
            if (volume === void 0) { volume = null; }
            if (pos === void 0) { pos = null; }
            var o = { cb: null };
            var cb = function (sound) {
                var found = false;
                var inx = -1;
                for (var i = 0; i < _this.loadingCallbacks.length; ++i) {
                    if (_this.loadingCallbacks[i] == o) {
                        inx = i;
                        found = true;
                        break;
                    }
                }
                if (!found)
                    return;
                _this.loadingCallbacks.splice(inx, 1);
                if (pos)
                    sound.seek(pos);
                if (volume)
                    sound.volume(volume);
                _this.play(null, sound);
            };
            o.cb = cb;
            this.loadingCallbacks.push(o);
            this.loadOneSound(MUSIC_PATH + fullName, cb);
        };
        Sound.prototype.lazyPlaySound = function (fullName) {
            var _this = this;
            this.loadOneSound(SOUND_PATH + fullName, function (sound) {
                _this.play(null, sound);
            });
        };
        Sound.prototype.stopAll = function () {
            for (var _i = 0, _a = this.soundsPlaying; _i < _a.length; _i++) {
                var x = _a[_i];
                x.stop();
            }
            this.loadingCallbacks = [];
        };
        Sound.prototype.loadOneSound = function (s, cb) {
            var noExt = s.split("/").pop().replace(/\.[^/.]+$/, "");
            noExt = noExt.toLowerCase();
            var sound = new Howl({
                src: s,
                autoplay: false,
                loop: false,
                volume: 1,
            });
            this.sounds[noExt] = sound;
            this.sounds[noExt].once('load', function () {
                cb(sound);
            });
        };
        Sound.prototype.load = function (musicAssets, soundAssets, cb) {
            this.sounds = {};
            var c = 0;
            for (var _i = 0, musicAssets_1 = musicAssets; _i < musicAssets_1.length; _i++) {
                var x = musicAssets_1[_i];
                this.loadOneSound(MUSIC_PATH + x, function () {
                    c++;
                    if (c == soundAssets.length + musicAssets.length) {
                        cb();
                    }
                });
            }
            for (var _a = 0, soundAssets_1 = soundAssets; _a < soundAssets_1.length; _a++) {
                var x = soundAssets_1[_a];
                this.loadOneSound(SOUND_PATH + x, function () {
                    c++;
                    if (c == soundAssets.length + musicAssets.length) {
                        cb();
                    }
                });
            }
            if (c == soundAssets.length + musicAssets.length) {
                cb();
            }
        };
        Sound.prototype.playMusic = function (snd) {
        };
        Sound.prototype.unmute = function () {
        };
        Sound.prototype.mute = function () {
        };
        Sound.prototype.playRandom = function (arr) {
            this.play(Math_8.m.getRand(arr));
        };
        Sound.prototype.play = function (snd, sndObj) {
            var _this = this;
            if (sndObj === void 0) { sndObj = null; }
            if (!this.enabled)
                return;
            snd = snd.toLowerCase();
            try {
                var soundObj_1 = sndObj ? sndObj : this.sounds[snd];
                soundObj_1.play();
                this.soundsPlaying.push(soundObj_1);
                soundObj_1.on('end', function () {
                    _this.soundsPlaying.splice(_this.soundsPlaying.indexOf(soundObj_1), 1);
                });
            }
            catch (e) {
            }
        };
        ;
        return Sound;
    }());
    exports.Sound = Sound;
});
define("Neu/Application", ["require", "exports", "Neu/PIXIPlugins/AnimClip", "Neu/SM", "Neu/Loader", "ClientSettings", "Neu/Controls", "Neu/PauseTimer", "../lib/matter"], function (require, exports, AnimClip_2, SM_1, Loader_2, ClientSettings_2, Controls_1, PauseTimer_1, matter_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TweenMax = window.TweenMax;
    exports.TimelineMax = window.TimelineMax;
    exports.TweenLite = window.TweenLite;
    exports.PIXI = window.PIXI;
    exports.CustomEase = window.CustomEase;
    exports.Bounce = window.Bounce;
    exports.Linear = window.Linear;
    exports.Quad = window.Quad;
    exports.Power1 = window.Power1;
    exports.Power4 = window.Power4;
    exports.Power3 = window.Power3;
    exports.Power2 = window.Power2;
    exports.Sine = window.Sine;
    exports.Elastic = window.Elastic;
    exports.Expo = window.Expo;
    exports.SteppedEase = window.SteppedEase;
    exports.SlowMo = window.SlowMo;
    exports.Circ = window.Circ;
    exports.FMath = window.FMath;
    exports.$DEBUG = true;
    var Application = /** @class */ (function () {
        function Application(MIN_SCR_WIDTH, MIN_SCR_HEIGHT) {
            this.fMath = new exports.FMath(null);
            this.timer = new PauseTimer_1.PauseTimer();
            this.appScale = 1;
            this.activeTab = true;
            this.lastLoop = 0;
            this.worldSpeed = 1;
            this.debug = true;
            this.delta = 0;
            this.deltaSec = 0.01;
            this.totalFrames = 0;
            this.totalDelta = 0;
            this.timeScale = 1;
            this.isInitialLoading = true;
            this.resolution = 1;
            this.addStats = true;
            this.MIN_SCR_HEIGHT = MIN_SCR_HEIGHT;
            this.MIN_SCR_WIDTH = MIN_SCR_WIDTH;
            Application.One = this;
        }
        Application.prototype.start = function () {
            var _this = this;
            this.engine = matter_2.Engine.create();
            //TweenMax.lagSmoothing(0);
            exports.TweenLite.ticker.useRAF(true);
            document.addEventListener('contextmenu', function (event) {
                if (_this.onContext)
                    _this.onContext();
                event.preventDefault();
            });
            this.controls = new Controls_1.Controls();
            this.PIXI = exports.PIXI;
            this.resolution = this.appScale * window.devicePixelRatio;
            this.app = new exports.PIXI.Application(this.SCR_WIDTH, this.SCR_HEIGHT, {
                autoStart: false,
                clearBeforeRender: true,
                resolution: this.resolution, antialias: false,
                preserveDrawingBuffer: false, forceFXAA: true, backgroundColor: 0xffffff,
            });
            this.app.renderer = new exports.PIXI.WebGLRenderer({
                width: this.SCR_WIDTH, height: this.SCR_HEIGHT,
                resolution: this.resolution,
            });
            document.body.appendChild(this.app.view);
            this.app.stage = new exports.PIXI.display.Stage();
            if (this.addStats) {
                this.statsPIXIHook = new window.GStats.PIXIHooks(this.app);
                this.stats = new window.GStats.StatsJSAdapter(this.statsPIXIHook);
                document.body.appendChild(this.stats.stats.dom || this.stats.stats.domElement);
                this.stats.stats.domElement.style.position = "absolute";
                this.stats.stats.domElement.style.top = "0px";
            }
            this.sm = new SM_1.SM();
            this.sm.init();
            this.lm = new Loader_2.Loader();
            this.sm.createCamera();
            this.lastLoop = (new Date()).getTime();
            this.lastNetworkPing = this.lastLoop;
            var bindedProcess = this.process.bind(this);
            exports.TweenMax.ticker.addEventListener("tick", bindedProcess);
            this.app.ticker.add(this.animate, this, exports.PIXI.UPDATE_PRIORITY.HIGH);
            this.app.ticker.start();
        };
        Application.prototype.killTweensOf = function (obj) {
            var tweens = exports.TweenMax.getTweensOf(obj);
            for (var _i = 0, tweens_1 = tweens; _i < tweens_1.length; _i++) {
                var t = tweens_1[_i];
                if (t.totalProgress() != 1)
                    t.totalProgress(1).kill();
            }
            return null;
        };
        Application.prototype.killTweens = function () {
            var tweens = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                tweens[_i] = arguments[_i];
            }
            for (var _a = 0, tweens_2 = tweens; _a < tweens_2.length; _a++) {
                var tween = tweens_2[_a];
                if (tween && tween.totalProgress() != 1)
                    tween.totalProgress(1).kill();
            }
            return null;
        };
        Application.prototype.addFilter = function (m, x) {
            var mm = (m);
            if (!mm._filters)
                mm._filters = [];
            mm._filters.push(x);
        };
        Application.prototype.removeFilterByType = function (main, ftype) {
            var m = main;
            if (!m._filters)
                return;
            for (var x = m._filters.length - 1; x >= 0; x--) {
                if (m._filters[x] instanceof ftype) {
                    m._filters.splice(x, 1);
                }
            }
        };
        Application.prototype.removeFilter = function (main, f) {
            var m = main;
            var inx = this.sm.main.filters.indexOf(f);
            if (~inx)
                m._filters.splice(inx, 1);
        };
        Application.prototype.setTimeScale = function (x) {
            exports.TweenMax.globalTimeScale(x);
            this.timeScale = x;
        };
        Application.prototype.animate = function () {
            this.controls.update();
            //this.process();
            if (this.addStats)
                this.stats.update();
            this.timer.process();
            this.random = Math.random();
            this.time = (new Date()).getTime();
            this.cursorPos = this.app.renderer.plugins.interaction.mouse.global;
        };
        Application.prototype.process = function () {
            if (!this.isInitialLoading) {
                var timeD = (this.time - this.lastLoop);
                this.lastLoop = this.time;
                this.deltaSec = timeD / 1000.;
                this.delta = timeD / ClientSettings_2.FRAME_DELAY;
                this.totalDelta += this.delta;
                this.totalFrames++;
                this.sm.process();
            }
        };
        Application.prototype.setScreenRes = function (baseW, baseH) {
            this.appScale = baseH / this.MIN_SCR_HEIGHT;
            //  if (this.appScale > 1.28) this.appScale = 1.28;
            this.SCR_WIDTH = Math.floor(baseW / this.appScale);
            this.SCR_HEIGHT = Math.floor(baseH / this.appScale);
            this.SCR_WIDTH_HALF = this.SCR_WIDTH * .5;
            this.SCR_HEIGHT_HALF = this.SCR_HEIGHT * .5;
            this.screenCenterOffset = [(this.SCR_WIDTH - this.MIN_SCR_WIDTH) * .5, (this.SCR_HEIGHT - this.MIN_SCR_HEIGHT) * .5];
        };
        Application.prototype.cm = function (s, layer, autoplay, times) {
            if (layer === void 0) { layer = null; }
            if (autoplay === void 0) { autoplay = false; }
            if (times === void 0) { times = null; }
            var textures = [];
            var keys = [];
            for (var key in exports.PIXI.utils.TextureCache) {
                if (key.indexOf(s) == 0) {
                    keys.push(key);
                }
            }
            var inx = 0;
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                if (times) {
                    textures.push({ texture: exports.PIXI.utils.TextureCache[key], time: times[inx] ? times[inx] : 1 });
                }
                else {
                    textures.push(exports.PIXI.utils.TextureCache[key]);
                }
                inx++;
            }
            var gfx = new AnimClip_2.AnimClip(textures);
            gfx.anchor.x = 0.5;
            gfx.anchor.y = 0.5;
            if (layer)
                layer.addChild(gfx);
            if (autoplay) {
                gfx.gotoAndPlay(0);
            }
            return gfx;
        };
        Application.prototype.cont = function (parentLayer) {
            var x = new exports.PIXI.Container();
            if (parentLayer) {
                parentLayer.addChild(x);
            }
            return x;
        };
        Application.prototype.csproj = function (s, layer) {
            if (layer === void 0) { layer = null; }
            var texture = exports.PIXI.Texture.fromFrame(s);
            var gfx = new exports.PIXI.projection.Sprite(texture);
            gfx.anchor.x = .5;
            gfx.anchor.y = .5;
            if (layer)
                layer.addChild(gfx);
            else {
            }
            return gfx;
        };
        Application.prototype.cc = function (layer) {
            if (layer === void 0) { layer = null; }
            var p = new exports.PIXI.Container();
            if (layer)
                layer.addChild(p);
            return p;
        };
        Application.prototype.cs = function (s, layer) {
            if (s === void 0) { s = null; }
            if (layer === void 0) { layer = null; }
            if (!s) {
                var cont = new exports.PIXI.Container();
                if (layer)
                    layer.addChild(cont);
                return cont;
            }
            var texture;
            if (exports.PIXI.utils.TextureCache[s]) {
                texture = exports.PIXI.Texture.fromFrame(s);
            }
            else {
                texture = exports.PIXI.Texture.fromFrame(s + '.png');
            }
            if (!texture) {
                console.log("Can't find ", s);
                return null;
            }
            if (texture) {
                var gfx = new exports.PIXI.heaven.Sprite(texture);
                gfx.anchor.x = .5;
                gfx.anchor.y = .5;
                if (layer)
                    layer.addChild(gfx);
                return gfx;
            }
            else {
                console.log("Can't find ", s);
                return null;
            }
        };
        Application.prototype.csStd = function (s, layer) {
            if (layer === void 0) { layer = null; }
            var texture;
            if (exports.PIXI.utils.TextureCache[s]) {
                texture = exports.PIXI.Texture.fromFrame(s);
            }
            else {
                texture = exports.PIXI.Texture.fromFrame(s + '.png');
            }
            if (!texture) {
                console.log("Can't find ", s);
                return null;
            }
            if (texture) {
                var gfx = new exports.PIXI.Sprite(texture);
                gfx.anchor.x = .5;
                gfx.anchor.y = .5;
                if (layer)
                    layer.addChild(gfx);
                else {
                }
                return gfx;
            }
            else {
                console.log("Can't find ", s);
                return null;
            }
        };
        Application.prototype._ = function (s) {
            return this.sm.findOne(s);
        };
        return Application;
    }());
    exports.Application = Application;
});
define("Stages/Rules", ["require", "exports", "Neu/Stage", "main", "Neu/BaseObjects/TextBox", "Objects/ScrollBox", "Neu/BaseObjects/O"], function (require, exports, Stage_3, main_19, TextBox_8, ScrollBox_2, O_19) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Rules = /** @class */ (function (_super) {
        __extends(Rules, _super);
        function Rules() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.withPlay = false;
            return _this;
        }
        Rules.prototype.addLine = function (inx, data) {
            if (main_19._.sm.stage != this)
                return;
            var tbname = new TextBox_8.TextBox([180, 580 + inx * 60]);
            tbname.init({ text: data.name + (data.lastname != "") ? (" " + data.lastname) : "" });
            var tbscore = new TextBox_8.TextBox([570, 580 + inx * 60]);
            tbscore.init({ align: "right", text: data.score.toString() });
        };
        Rules.prototype.onShow = function () {
            var _this = this;
            _super.prototype.onShow.call(this);
            main_19._.lm.load(this, 'rules', null);
            main_19._.sm.findOne("btnreturn").click = function () {
                main_19._.sm.openStage(main_19._.menu);
            };
            var scrollbox = main_19._.sm.findByType(ScrollBox_2.ScrollBox)[0];
            var m = main_19._.sm.findMultiple("toscrollbox");
            for (var _i = 0, m_1 = m; _i < m_1.length; _i++) {
                var x = m_1[_i];
                O_19.O.rp(x.gfx);
                scrollbox.masked.addChild(x.gfx);
            }
            var btnplay = main_19._.sm.findOne("btnplay");
            var btnnext = main_19._.sm.findOne("btnnext");
            var btnback = main_19._.sm.findOne("btnback");
            btnplay.gfx.visible = false;
            this.page = 0;
            this.updateButtons();
            btnnext.click = function () {
                _this.page++;
                _this.updateButtons();
            };
            btnplay.click = function () {
                main_19._.sm.openStage(main_19._.game);
            };
            btnback.click = function () {
                _this.page--;
                _this.updateButtons();
            };
            if (this.withPlay) {
            }
            else {
            }
        };
        Rules.prototype.updateButtons = function () {
            var scrollbox = main_19._.sm.findByType(ScrollBox_2.ScrollBox)[0];
            var btnplay = main_19._.sm.findOne("btnplay");
            var btnnext = main_19._.sm.findOne("btnnext");
            var btnback = main_19._.sm.findOne("btnback");
            var offs = 100;
            if (this.page == 0) {
                scrollbox.masked.y = offs;
                btnback.gfx.visible = false;
                btnnext.gfx.visible = true;
            }
            if (this.page == 1) {
                scrollbox.masked.y = -730 + offs;
                btnnext.gfx.visible = true;
                btnback.gfx.visible = true;
            }
            if (this.page == 2) {
                scrollbox.masked.y = -1400 + offs;
                btnnext.gfx.visible = false;
                btnback.gfx.visible = true;
                if (this.withPlay) {
                    btnplay.gfx.visible = true;
                }
                else {
                    btnplay.gfx.visible = false;
                }
            }
            else {
            }
        };
        return Rules;
    }(Stage_3.Stage));
    exports.Rules = Rules;
});
define("Stages/Scores", ["require", "exports", "Neu/Stage", "main", "Neu/BaseObjects/TextBox", "Objects/ScrollBox", "Neu/BaseObjects/O"], function (require, exports, Stage_4, main_20, TextBox_9, ScrollBox_3, O_20) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Scores = /** @class */ (function (_super) {
        __extends(Scores, _super);
        function Scores() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Scores.prototype.addLine = function (inx, data) {
            if (main_20._.sm.stage != this)
                return;
            var tbname = new TextBox_9.TextBox([180, 120 + inx * 60]);
            tbname.init({ text: data.name + (data.lastname != "") ? (" " + data.lastname) : "" });
            var tbscore = new TextBox_9.TextBox([570, 120 + inx * 60]);
            tbscore.init({ align: "right", text: data.score.toString() });
            var scrollbox = main_20._.sm.findByType(ScrollBox_3.ScrollBox)[0];
            O_20.O.rp(tbname.gfx);
            O_20.O.rp(tbscore.gfx);
            scrollbox.masked.addChild(tbname.gfx, tbscore.gfx);
        };
        Scores.prototype.getLeaderboard = function () {
            var _this = this;
            main_20.$.post(window.API_PHP_FILE, { func: "leaderboard" })
                .done(function (data) {
                var d = JSON.parse(data);
                var inx = 0;
                for (var _i = 0, d_2 = d; _i < d_2.length; _i++) {
                    var x = d_2[_i];
                    //   if (inx > 10) break;
                    _this.addLine(inx, d[inx]);
                    inx++;
                } ///
            });
        };
        Scores.prototype.onShow = function () {
            _super.prototype.onShow.call(this);
            main_20._.lm.load(this, 'scores', null);
            if (window.RESULT_MODAL_IN_MENU) {
                main_20._.game.score = 999;
                main_20._.game.ShowResModal();
            }
            main_20._.sm.findOne("btnback").click = function () {
                main_20._.sm.openStage(main_20._.menu);
            };
            var scrollbox = main_20._.sm.findByType(ScrollBox_3.ScrollBox)[0];
            scrollbox.maxScroll = 550;
            // let g = _.cs("btnton1.png");
            // g.scale.x = 1.5;
            // g.scale.y = 1.5;
            // let btnTON = new Button(_.sm.findOne("btntonpos").pos, g);
            // btnTON.init({text:"N+1", fontscale: 0.7,});
            // (<Button>btnTON).click = () => {
            //     window.open((<any>window).LINK_TO_SOCIAL);
            // };
            //_.sm.gui2.addChild(btnTON.gfx);
            this.getLeaderboard();
        };
        return Scores;
    }(Stage_4.Stage));
    exports.Scores = Scores;
});
define("main", ["require", "exports", "Neu/Application", "Neu/Sound", "Stages/Menu", "Stages/Game", "Neu/Math", "./lib/matter", "Neu/ResourceManager", "ClientSettings", "Neu/BaseObjects/TextBox", "Neu/BaseObjects/BaseLighting", "ObjectsList", "Stages/Rules", "Stages/Scores", "Neu/Controls", "Neu/SM", "Neu/Loader", "./lib/pixi-heaven.js"], function (require, exports, Application_21, Sound_1, Menu_2, Game_2, Math_9, matter_3, ResourceManager_1, ClientSettings_3, TextBox_10, BaseLighting_3, ObjectsList_2, Rules_1, Scores_1, Controls_2, SM_2, Loader_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$ = window.$;
    exports.SCR_WIDTH = ClientSettings_3.MAX_SCR_WIDTH;
    exports.SCR_HEIGHT = ClientSettings_3.MAX_SCR_HEIGHT;
    var GLOBAL_MUSIC_ASSETS = [];
    var GLOBAL_SOUND_ASSETS = []; //
    TextBox_10.TextBox.DEFAULT_FONT = "main-export";
    var GLOBAL_ASSETS = [
        ///////////////////////////////////////////
        // Atlases
        ///////////////////////////////////////////
        'art/atlas.json',
        ///////////////////////////////////////////
        // Fonts
        ///////////////////////////////////////////
        'fonts/main-export.xml',
    ];
    exports.PIXIUI = Application_21.PIXI.UI;
    var Main = /** @class */ (function (_super) {
        __extends(Main, _super);
        function Main(msw, msh) {
            var _this = _super.call(this, msw, msh) || this;
            _this.menu = new Menu_2.Menu();
            _this.game = new Game_2.Game();
            _this.rules = new Rules_1.Rules();
            _this.scores = new Scores_1.Scores();
            _this.assetsLoaded = 0;
            _this.loadingCounter = 0;
            _this.__DIR = location.pathname.substring(0, location.pathname.lastIndexOf('/') + 1);
            return _this;
        }
        Main.GET = function (url, cb) {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                    cb(xmlHttp.responseText);
                }
            };
            xmlHttp.open("GET", url, true); // true for asynchronous
            xmlHttp.send(null);
        };
        Main.prototype.start = function () {
            var _this = this;
            this.addStats = false;
            this.SCR_WIDTH = exports.SCR_WIDTH;
            this.SCR_HEIGHT = exports.SCR_HEIGHT;
            console.log("Device pixel ratio: ", window.devicePixelRatio);
            var resize = function () {
                var myratio = _this.SCR_WIDTH / _this.SCR_HEIGHT;
                var screenratio = window.innerWidth / window.innerHeight;
                if (myratio > screenratio) {
                    _this.appScale = ((window.innerWidth) / _this.SCR_WIDTH);
                    var nn = window.innerWidth * myratio;
                }
                else {
                    _this.appScale = ((window.innerHeight) / _this.SCR_HEIGHT);
                    var nn = window.innerHeight * myratio;
                }
                _this.app.renderer.resize(_this.SCR_WIDTH * _this.appScale, _this.SCR_HEIGHT * _this.appScale);
                //            let delta = (window.innerWidth - neww) / 2;
                //           if (delta < 0) delta = 0;
                _this.screenCenterOffset = [0, 0]; //[delta * this.appScale,0];
                _this.app.stage.scale.set(_this.appScale, _this.appScale);
            };
            window.addEventListener('resize', resize);
            setTimeout(function () {
                resize();
            }, 200);
            setTimeout(function () {
                resize();
            }, 0);
            this.SCR_WIDTH_HALF = this.SCR_WIDTH * .5;
            this.SCR_HEIGHT_HALF = this.SCR_HEIGHT * .5;
            this.engine = matter_3.Engine.create();
            //TweenMax.lagSmoothing(0);
            Application_21.TweenLite.ticker.useRAF(true);
            document.addEventListener('contextmenu', function (event) {
                if (_this.onContext)
                    _this.onContext();
                event.preventDefault();
            });
            this.controls = new Controls_2.Controls();
            this.PIXI = Application_21.PIXI;
            this.resolution = window.devicePixelRatio;
            this.app = new Application_21.PIXI.Application(this.SCR_WIDTH, this.SCR_HEIGHT, {
                autoStart: false,
                clearBeforeRender: true,
                resolution: 1, antialias: false,
                preserveDrawingBuffer: false, forceFXAA: false, backgroundColor: 0xffffff,
            });
            document.body.appendChild(this.app.view);
            this.app.stage = new Application_21.PIXI.display.Stage();
            this.sm = new SM_2.SM();
            this.sm.init();
            this.lm = new Loader_3.Loader();
            this.sm.createCamera();
            this.lastLoop = (new Date()).getTime();
            this.lastNetworkPing = this.lastLoop;
            var bindedProcess = this.process.bind(this);
            Application_21.TweenMax.ticker.addEventListener("tick", bindedProcess);
            this.app.ticker.add(this.animate, this, Application_21.PIXI.UPDATE_PRIORITY.HIGH);
            this.app.ticker.start();
            resize();
        };
        ;
        Main.prototype.loadComplete = function () {
            var _this = this;
            this.isInitialLoading = false;
            this.loadTime = (new Date()).getTime() - window.startTime.getTime();
            this.clearPreloader();
            Application_21.PIXI.BitmapText.fonts[TextBox_10.TextBox.DEFAULT_FONT].lineHeight *= 0.7;
            var interaction = this.app.renderer.plugins.interaction;
            document.addEventListener('mousedown', function (e) {
                if (_this.globalMouseDown)
                    _this.globalMouseDown(e);
            });
            exports._.sm.openStage(exports._.menu);
        };
        Main.prototype.initPreloader = function () {
            this.preloadBar = new Application_21.PIXI.Graphics();
            this.app.stage.addChild(this.preloadBar);
            var borderWidth = 3;
            this.preloadBar.beginFill(0x100110);
            this.preloadBar.moveTo(exports._.screenCenterOffset[0] + ClientSettings_3.MAX_SCR_WIDTH * 0.1 - borderWidth, exports._.screenCenterOffset[1] + ClientSettings_3.MAX_SCR_HEIGHT * 0.495 - borderWidth);
            this.preloadBar.lineTo(exports._.screenCenterOffset[0] + ClientSettings_3.MAX_SCR_WIDTH * 0.9 + borderWidth, exports._.screenCenterOffset[1] + ClientSettings_3.MAX_SCR_HEIGHT * 0.495 - borderWidth);
            this.preloadBar.lineTo(exports._.screenCenterOffset[0] + ClientSettings_3.MAX_SCR_WIDTH * 0.9 + borderWidth, exports._.screenCenterOffset[1] + ClientSettings_3.MAX_SCR_HEIGHT * 0.505 + borderWidth);
            this.preloadBar.lineTo(exports._.screenCenterOffset[0] + ClientSettings_3.MAX_SCR_WIDTH * 0.1 - borderWidth, exports._.screenCenterOffset[1] + ClientSettings_3.MAX_SCR_HEIGHT * 0.505 + borderWidth);
            this.preloadBar.endFill();
        };
        Main.prototype.drawPreloaderProgress = function (progressPercent) {
            this.preloadBar.beginFill(0x350929);
            var progress = progressPercent / 100;
            this.preloadBar.moveTo(exports._.screenCenterOffset[0] + ClientSettings_3.MAX_SCR_WIDTH * 0.1, exports._.screenCenterOffset[1] + ClientSettings_3.MAX_SCR_HEIGHT * 0.495);
            this.preloadBar.lineTo(exports._.screenCenterOffset[0] + ClientSettings_3.MAX_SCR_WIDTH * 0.1 + ClientSettings_3.MAX_SCR_WIDTH * 0.8 * progress, exports._.screenCenterOffset[1] + ClientSettings_3.MAX_SCR_HEIGHT * 0.495);
            this.preloadBar.lineTo(exports._.screenCenterOffset[0] + ClientSettings_3.MAX_SCR_WIDTH * 0.1 + ClientSettings_3.MAX_SCR_WIDTH * 0.8 * progress, exports._.screenCenterOffset[1] + ClientSettings_3.MAX_SCR_HEIGHT * 0.505);
            this.preloadBar.lineTo(exports._.screenCenterOffset[0] + ClientSettings_3.MAX_SCR_WIDTH * 0.1, exports._.screenCenterOffset[1] + ClientSettings_3.MAX_SCR_HEIGHT * 0.505);
            this.preloadBar.endFill();
        };
        Main.prototype.clearPreloader = function () {
            this.app.stage.removeChild(this.preloadBar);
        };
        Main.prototype.load = function () {
            var _this = this;
            this.loadingCounter = 0;
            this.initPreloader();
            this.engine = matter_3.Engine.create();
            var runner = matter_3.Runner.create({});
            BaseLighting_3.BaseLighting.DEFAULT_GFX = "Camera-Shadow.png";
            matter_3.Runner.run(runner, this.engine);
            var loadQueue = new Math_9.LoadQueue(function () {
                _this.drawPreloaderProgress(100);
                _this.loadComplete();
            });
            this.rm = new ResourceManager_1.ResourceManager("animations/");
            this.rm.loadAssets(GLOBAL_ASSETS.concat(ObjectsList_2.LevelNames), function (loader, evt) {
                _this.drawPreloaderProgress(loader.progress);
                _this.assetsLoaded++;
            }, loadQueue.onLoad().bind(loadQueue));
            this.sound = new Sound_1.Sound();
            this.sound.load(GLOBAL_MUSIC_ASSETS, GLOBAL_SOUND_ASSETS, loadQueue.onLoad());
            document.addEventListener("keydown", function (e) {
                var keyCode = e.keyCode;
                switch (keyCode) {
                    case 68: //d
                        exports._.sm.camera.x += 22.5;
                        break;
                    case 83: //s
                        exports._.sm.camera.y += 22.5;
                        break;
                    case 65: //a
                        exports._.sm.camera.x -= 22.5;
                        break;
                    case 87: //w
                        exports._.sm.camera.y -= 22.5;
                        break;
                    case 88: //x
                        exports._.sm.camera.zoom -= 0.02;
                        break;
                    case 90: //z
                        exports._.sm.camera.zoom += 0.02;
                        break;
                }
            });
        };
        return Main;
    }(Application_21.Application));
    exports.Main = Main;
    exports._ = new Main(ClientSettings_3.MAX_SCR_WIDTH, ClientSettings_3.MAX_SCR_HEIGHT);
    exports._.start();
    exports._.load();
});
